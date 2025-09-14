import Hero from '../components/Hero.jsx'
import { Link } from 'react-router-dom'
import { sampleBooks } from '../lib/data.js'
import PublicationCard from '../components/PublicationCard.jsx'

const Stats = () => (
    <section className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {[
                { label: 'Total Books', value: '15,000+' },
                { label: 'Active Members', value: '3,500+' },
                { label: 'Open Hours', value: '12 hrs/day' },
            ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-6 text-center w-full max-w-xs">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                </div>
            ))}
        </div>
    </section>
)



const Featured = () => {
  const featured = sampleBooks.slice(0, 5);
  return (
    <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Books</h2>
          <button className="btn btn-outline">View All Books</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {featured.map((book) => (
            <PublicationCard key={book.id} item={book} />
          ))}
        </div>
      </section>
  )
}

const Announcements = () => (
  <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="font-medium">Library Hours Extended</h4>
              <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="font-medium">New Digital Resources Available</h4>
              <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="font-medium">Book Return Reminder</h4>
              <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        </div>

        <div>
      <h3 className="font-semibold mb-3">Quick Actions</h3>
      <div className="space-y-3">
        <Link className="card p-4 block" to="/resources">Search Resources</Link>
        <Link className="card p-4 block" to="/about/rules">Library Rules</Link>
        <Link className="card p-4 block" to="/contact">Contact Librarian</Link>
      </div>
    </div>
      </section>
)

export default function Home() {

  return (
    <div>
      
      <Hero />

      <Stats/>

      <Featured/>

      <Announcements/>

    </div>
  );
}