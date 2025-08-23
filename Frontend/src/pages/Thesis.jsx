// src/pages/Thesis.jsx
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Formik } from "formik";
import { theses, THESIS_DEPARTMENTS } from "../api/theses";

import SearchBar from "../components/SearchBar.jsx";
import SelectField from "../components/SelectField.jsx";
import Pagination from "../components/Pagination.jsx";

const PAGE_SIZE = 6;

export default function Thesis() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [dept, setDept] = useState(params.get("dept") || "All Departments");
  const [page, setPage] = useState(Number(params.get("page")) || 1);

  const syncUrl = (p = page, q = query, d = dept) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (d && d !== "All Departments") next.set("dept", d);
    next.set("page", String(p));
    setParams(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return theses.filter((t) => {
      const matchesQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.keywords.join(" ").toLowerCase().includes(q);
      const matchesDept = dept === "All Departments" || t.department === dept;
      return matchesQ && matchesDept;
    });
  }, [query, dept]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // SelectField expects [{label, value}]
  const deptOptions = THESIS_DEPARTMENTS.map((d) => ({ label: d, value: d }));

  return (
    <div>
      {/* Header */}
      <section className="container mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Thesis Repository</h1>
            <p className="text-gray-600">
              Explore research papers and thesis from AUST students
            </p>
          </div>

          {/* Department filter via your SelectField (Formik wrapper) */}
          <div className="w-full sm:w-72">
            <Formik initialValues={{ dept }} enableReinitialize>
              {({ setFieldValue }) => (
                <SelectField
                  name="dept"
                  label="Department"
                  options={deptOptions}
                  value={dept}
                  // override onChange so we sync state + URL
                  onChange={(e) => {
                    const v = e.target.value;
                    setFieldValue("dept", v);
                    setDept(v);
                    setPage(1);
                    syncUrl(1, query, v);
                  }}
                />
              )}
            </Formik>
          </div>
        </div>

        {/* Search via your SearchBar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
              syncUrl(1, v, dept);
            }}
            onSubmit={() => {
              // If you want Enter/Search button to force-sync (already synced in onChange)
              syncUrl(1, query, dept);
            }}
            placeholder="Search by title, author, or keywords…"
          />
          <div className="text-sm text-gray-500 self-center">
            Showing {filtered.length} of {theses.length}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="container mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((t) => (
            <article key={t.id} className="bg-white rounded-2xl shadow p-5 flex flex-col">
              <img src={t.thumbnail} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />
              <div className="flex-1">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <h2 className="font-semibold text-lg flex-1">{t.title}</h2>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{t.department}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{t.level}</span>
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap gap-3 mb-2">
                  <span>👤 {t.author}</span>
                  <span>📅 {t.year}</span>
                  <span>📄 {t.pages} pages</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{t.abstract}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {t.keywords.slice(0, 4).map((k) => (
                    <span key={k} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/thesis/${t.id}`}
                  className="btn btn-primary h-10 px-4 rounded-xl bg-gray-900 text-white hover:bg-gray-800 inline-flex items-center justify-center"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination via your component */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {safePage} of {totalPages}
          </div>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={(next) => {
              const n = Number(next);
              setPage(n);
              syncUrl(n);
            }}
          />
        </div>
      </section>
    </div>
  );
}
