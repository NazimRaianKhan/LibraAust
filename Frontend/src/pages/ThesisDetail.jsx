import { Link, useParams } from "react-router-dom";
import { getThesisById } from "../api/theses";

export default function ThesisDetail() {
  const { id } = useParams();
  const thesis = getThesisById(id);

  if (!thesis) {
    return (
      <section className="container mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-4">Thesis not found</h1>
        <Link to="/resources/thesis" className="text-indigo-600 underline">
          Back to Thesis
        </Link>
      </section>
    );
  }

  return (
    <div>
      <section className="container mx-auto px-6 pt-10 pb-6">
        <Link to="/resources/thesis" className="text-indigo-600">← Back to Thesis</Link>
        <h1 className="text-3xl font-bold mt-2">{thesis.title}</h1>
        <div className="text-gray-600 mt-1">
          👤 {thesis.author} · 📅 {thesis.year} · 📄 {thesis.pages} pages
        </div>
        <div className="mt-2 flex gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{thesis.department}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{thesis.level}</span>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <img
            src={thesis.thumbnail}
            alt="cover"
            className="w-full h-64 object-cover rounded-2xl shadow"
          />

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Abstract</h2>
            <p className="text-gray-700 leading-7">{thesis.abstract}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-7">{thesis.description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {thesis.keywords.map((k) => (
                <span key={k} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-medium">Supervisor</div>
            <div className="text-gray-700">{thesis.supervisor}</div>
          </div>
          <a
            href={thesis.pdfUrl}
            className="block text-center h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800 leading-[3rem]"
          >
            Download PDF
          </a>
          <button className="h-12 rounded-xl border border-gray-300 w-full">Cite</button>
        </aside>
      </section>
    </div>
  );
}
