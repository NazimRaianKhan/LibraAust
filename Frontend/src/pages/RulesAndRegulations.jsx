import React from 'react';

// Main App component
const App = () => {
  return (
    <div className="flex items-center justify-center p-4 font-sans">
      <div className="text-2xl font-sans text-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Rules & Regulations</h1>
        <p className="text-sm text-gray-500 mb-6">Guidelines for using KFR Library services and facilities</p>

        {/* Warning Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <img 
              src="/Warning.png" 
              alt="Warning Icon" 
              className="h-6 w-6 mr-3"
            />
            <p className="text-sm">All library users are expected to familiarize themselves with and adhere to these rules. Violation of library policies may result in suspension of library privileges.</p>
          </div>
        </div>

        {/* Membership Eligibility Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-3">
            <img 
              src="/Card.png"
              alt="Card Icon" 
              className="h-5 w-5 mr-2"
            />
            <h2 className="text-lg font-bold text-gray-800">Membership Eligibility</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Requirements for library access and membership</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">All AUST students, faculty, and staff are eligible for library membership</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Valid university ID card must be presented for library services</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Membership is automatically activated upon enrollment/employment</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Lost ID cards must be reported immediately to prevent misuse</p>
            </li>
          </ul>
        </div>
        
        {/* Borrowing Policies Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <img 
              src="/Books.svg" 
              alt="Borrowing Icon" 
              className="h-5 w-5 mr-2"
            />
            <h2 className="text-lg font-bold text-gray-800">Borrowing Policies</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Book borrowing limits and duration by user category</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Students Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img 
                  src="/Student.png" 
                  alt="Student Icon" 
                  className="h-6 w-6 mr-2"
                />
                <h3 className="font-bold text-gray-800">Students</h3>
              </div>
              <p className="text-sm text-gray-700"><span className="font-semibold">Max Books:</span> 3</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> 14 days</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Renewals:</span> 1 time (if not reserved)</p>
            </div>
            {/* Faculty Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img 
                  src="/Faculty.png" 
                  alt="Faculty Icon" 
                  className="h-6 w-6 mr-2"
                />
                <h3 className="font-bold text-gray-800">Faculty</h3>
              </div>
              <p className="text-sm text-gray-700"><span className="font-semibold">Max Books:</span> 10</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> 30 days</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Renewals:</span> 2 times</p>
            </div>
            {/* Research Students Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img 
                  src="/Research.png" 
                  alt="Research Icon" 
                  className="h-6 w-6 mr-2"
                />
                <h3 className="font-bold text-gray-800">Research Students</h3>
              </div>
              <p className="text-sm text-gray-700"><span className="font-semibold">Max Books:</span> 5</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> 21 days</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Renewals:</span> 1 time</p>
            </div>
          </div>
        </div>

        {/* Additional Borrowing Rules Section */}
          <h3 className="text-lg font-bold text-gray-800 mb-4">Additional Borrowing Rules:</h3>
          <ul className="list-none space-y-2">
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Books can be renewed only if not reserved by another user</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Reference books and journals cannot be borrowed</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Reservations can be made online or at the circulation desk</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Overdue books must be returned before borrowing new ones</p>
            </li>
          </ul>
        </div>

        {/* Code of Conduct Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-3">
            <img 
              src="/Shield.png" 
              alt="Conduct Icon" 
              className="h-5 w-5 mr-2"
            />
            <h2 className="text-lg font-bold text-gray-800">Code of Conduct</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Behavioral expectations within the library premises</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-none space-y-2">
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Maintain complete silence in reading areas</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">No food or drinks allowed inside the library</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Books and materials must be handled with care</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Photography without permission is not allowed</p>
              </li>
            </ul>
            <ul className="list-none space-y-2">
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Mobile phones must be on silent mode</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Smoking is strictly prohibited throughout the premises</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Library property should not be damaged or defaced</p>
              </li>
              <li className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-sm text-gray-700">Sleeping in the library is not permitted</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Fine Structure Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-3">
            <img 
              src="/Taka.png" 
              alt="Fine Icon" 
              className="h-5 w-5 mr-2"
            />
            <h2 className="text-lg font-bold text-gray-800">Fine Structure</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Penalty charges for various violations</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm text-gray-700 font-semibold">Late return (per day, per book)</p>
              <span className="text-sm text-gray-700 font-bold">5 BDT</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm text-gray-700 font-semibold">Lost book replacement</p>
              <span className="text-sm text-gray-700 font-bold">Book cost + 100 BDT processing</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm text-gray-700 font-semibold">Damaged book</p>
              <span className="text-sm text-gray-700 font-bold">Repair cost or replacement</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm text-gray-700 font-semibold">Lost ID card</p>
              <span className="text-sm text-gray-700 font-bold">50 BDT replacement fee</span>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg mt-4">
            <p className="text-sm"><span className="font-semibold">Note:</span> All fines must be paid before borrowing new books or receiving other library services.</p>
          </div>
        </div>

        {/* Digital Resources Policy Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-3">
            <img 
              src="/Digital resources.png" 
              alt="Digital Icon" 
              className="h-5 w-5 mr-2"
            />
            <h2 className="text-lg font-bold text-gray-800">Digital Resources Policy</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Guidelines for using online databases and digital collections</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Digital resources are for academic and research purposes only</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Sharing login credentials is strictly prohibited</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Bulk downloading of materials is not allowed</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Copyright laws must be respected for all digital content</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">Personal devices must not interfere with library systems</p>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <p className="text-sm text-gray-700">WiFi usage should be for academic purposes primarily</p>
            </li>
          </ul>
        </div>

        {/* Clarification Section */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Need Clarification?</h2>
          <p className="text-sm text-gray-700 mb-2">If you have any questions about these rules or need clarification on any policy, please don't hesitate to contact our library staff.</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Phone:</span> +880-2-8870422</p>
            <p><span className="font-semibold">Email:</span> library@aust.edu</p>
            <p><span className="font-semibold">Desk Hours:</span> 8:00 AM - 6:00 PM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;