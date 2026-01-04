import axiosInstance from './Axios';
import React, { useEffect, useState } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axiosInstance.get('/content')
      .then(response => setEmployees(response.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mt-10 mb-8">
        Meet Our Team
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
              alt={employee.name}
              className="w-16 h-16 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {employee.name}
              </h2>
              <p className="text-gray-600">{employee.role}</p>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <p className="text-center text-gray-500 mt-20">No employees found.</p>
      )}
    </div>
  );
}

export default App;
