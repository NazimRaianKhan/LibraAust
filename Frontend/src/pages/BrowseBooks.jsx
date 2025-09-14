import React from "react";

export default function AboutLibrary() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-justify">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          About KFR Library
        </h2>
        <p className="text-gray-600 mt-1 mb-4">
          Knowledge, Resources, and Research Hub at AUST
        </p>

      {/* Image */}
        <div className="flex justify mb-6">
        <img
          src="/Smiling man.svg"
          alt="Maybe an image of a smiling man."
          className="rounded-xl shadow-lg object-cover w-full max-w-md"
        />
      </div>
        
        {/*Our mission area*/}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Our Mission
        </h3>

        <p className="text-gray-700 leading-relaxed">
          The KFR Library at Ahsanullah University of Science and Technology
          serves as the intellectual heart of our campus, providing comprehensive
          resources and services to support the academic and research endeavors
          of our students, faculty, and staff.
        </p>

        <p className="text-gray-700 leading-relaxed mt-3">
          Named after the university's founder, KFR Library is committed to
          fostering a culture of learning, innovation, and knowledge sharing
          through state-of-the-art facilities and expert library services.
        </p>

        {/*After our mission*/}
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
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Library facilities
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            
          {[  
          
          //Library facilities
          { label: <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Extensive Collection
          </h3>
          ,
        
            value: <div className="flex justify mb-6">
            <img
                src="/Extensive collection.png"
                alt="Logo of an open book."
                className="rounded-xl lg object-cover w-full max-w-md"
            />
              </div>
          },
          
          { label: <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Digital Resources
          </h3>
          ,
        
            value: <div className="flex justify mb-6">
            <img
                src="/Digital resources.png"
                alt="Logo of a desktop computer."
                className="rounded-xl lg object-cover w-full max-w-md"
            />
              </div>
          },

            
          { label: <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Free Wi-Fi
          </h3>
          ,
        
            value: <div className="flex justify mb-6">
            <img
                src="/Wi-Fi.png"
                alt="Logo of Wi-Fi."
                className="rounded-xl lg object-cover w-full max-w-md"
            />
              </div>
          },

          { label: <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Study Areas
          </h3>
          ,
        
            value: <div className="flex justify mb-6">
            <img
                src="/Group study.png"
                alt="Logo of two persons."
                className="rounded-xl lg object-cover w-full max-w-md"
            />
              </div>
          },

            ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-6 text-center w-full max-w-xs">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}