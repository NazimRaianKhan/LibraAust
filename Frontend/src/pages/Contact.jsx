// src/pages/ContactUs.jsx
import { useState, useEffect } from 'react';

const ContactUs = () => {
  // Mock data for librarians - this will be replaced with API data later
  const [librarians, setLibrarians] = useState([
    {
      id: 1,
      name: "Dr. Rashida Begum",
      position: "Chief Librarian",
      department: "Library Administration",
      description: "Dr. Rashida Begum leads the library operations and strategic planning for AUST library services.",
      qualifications: "PhD in Library Science, University of Dhaka",
      experience: "15+ years experience",
      specializations: ["Information Management", "Digital Libraries", "Research Support"],
      email: "rashida.begum@aust.edu",
      phone: "+880-2-8870422"
    },
    {
      id: 2,
      name: "Mohammad Hassan",
      position: "Senior Librarian", 
      department: "Technical Services",
      description: "Manages technical operations, cataloging systems, and database maintenance for the library.",
      qualifications: "Masters in Library & Information Science",
      experience: "12+ years experience",
      specializations: ["Cataloging", "Database Management", "Technical Support"],
      email: "hassan@aust.edu",
      phone: "+880-2-8870423"
    }
  ]);

  const services = [
    {
      title: "Research Assistance",
      description: "Help finding books, articles, and research materials for your academic projects.",
      icon: "🔍"
    },
    {
      title: "Information Literacy", 
      description: "Training sessions on effective research techniques and source evaluation.",
      icon: "📚"
    },
    {
      title: "Reference Services",
      description: "Expert guidance on using library resources and research methodologies.", 
      icon: "💡"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our library team for assistance
          </p>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Visit Us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visit Us</h2>
            <p className="text-gray-600 mb-4">Library location and contact details</p>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <p className="text-gray-600">
                KFR Library, 2nd Floor, Academic Building<br />
                Ahsanullah University of Science and Technology<br />
                141 & 142, Love Road, Teigaon, Dhaka-1208, Bangladesh
              </p>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-6">📞</span>
                  <span className="ml-2 text-gray-600">+880-2-8870422</span>
                  <span className="ml-2 text-sm text-gray-500">Main Line</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-6">📧</span>
                  <a 
                    href="mailto:library@aust.edu" 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    library@aust.edu
                  </a>
                  <span className="ml-2 text-sm text-gray-500">General Inquiries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Operating Hours</h2>
            <p className="text-gray-600 mb-4">When you can visit us</p>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sunday - Thursday</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Morning:</span>
                  <span className="font-medium">8:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evening:</span>
                  <span className="font-medium">3:00 PM - 8:00 PM</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Friday & Saturday</h4>
                <p className="text-gray-600">Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Services We Offer
          </h2>
          <p className="text-gray-600 text-center mb-8">
            How our library team can assist you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Meet Our Library Team
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Our dedicated librarians are here to help you with research, resources, and all your library needs.
          </p>

          <div className="space-y-12">
            {librarians.map((librarian) => (
              <div key={librarian.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Librarian Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {librarian.name}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-1">
                      {librarian.position}
                    </p>
                    <p className="text-gray-600 mb-4">{librarian.department}</p>
                    
                    <p className="text-gray-700 mb-4">{librarian.description}</p>
                    
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900">{librarian.qualifications}</p>
                      <p className="text-gray-600">{librarian.experience}</p>
                    </div>

                    {/* Specializations Table */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {librarian.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded text-center"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="w-6">📧</span>
                        <a
                          href={`mailto:${librarian.email}`}
                          className="ml-2 text-blue-600 hover:text-blue-800 break-all"
                        >
                          {librarian.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="w-6">📞</span>
                        <span className="ml-2 text-gray-600">{librarian.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;