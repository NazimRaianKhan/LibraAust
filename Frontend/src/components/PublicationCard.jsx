export default function PublicationCard({ item }) {
  return (
    <div className="group block p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition border border-gray-100">
      {/* Publication Cover */}
      <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-100">
        <img
          src={item.cover_url || "https://picsum.photos/seed/fallback/400/600"}
          alt={item.title}
          className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/seed/fallback/400/600";
          }}
        />
      </div>

      {/* Publication Info */}
      <h3 className="font-semibold text-gray-900 line-clamp-1">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-1">{item.author}</p>
    </div>
  );
}