import React from 'react'

const HostRequests = () => {
  return (
    <div>
        <Card/>
    </div>
  )
}

const Card = () => {
    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-medium text-gray-800">Visitation Request</div>
            <div className="flex space-x-2">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">
                Approve
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
                Decline
              </button>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Card Description goes here...</p>
        </div>
      </div>
    );
  };

export default HostRequests