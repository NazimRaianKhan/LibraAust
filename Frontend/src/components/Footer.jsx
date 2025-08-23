export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      {/* ✅ Center container */}
      <div className="container mx-auto max-w-7xl py-10 grid md:grid-cols-3 gap-8 px-4">
        <div>
          <h3 className="text-lg font-semibold">LibraAust</h3>
          <p className="text-sm text-gray-600 mt-2">
            Ahsanullah University of Science and Technology (AUST) Library Management System.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="link" href="/">Home</a></li>
            <li><a className="link" href="/resources">Resources</a></li>
            <li><a className="link" href="/about/kfr">About</a></li>
            <li><a className="link" href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">Email: library@aust.edu</p>
          <p className="text-sm">Phone: +880-2-123456</p>
          <p className="text-sm">Hours: 8:00 AM – 6:00 PM</p>
        </div>
      </div>

      {/* ✅ Centered bottom bar */}
      <div className="bg-gray-100 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} LibraAust. All rights reserved.
      </div>
    </footer>
  );
}
