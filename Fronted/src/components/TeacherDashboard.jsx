// pages/TeacherDashboard.jsx
import React from 'react';

const TeacherDashboard = () => {
  return (
    <div className="p-8 ml-64 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">Welcome, Teacher 👩‍🏫</h1>
      <p className="text-lg text-gray-700">
        This is your dashboard. Use the sidebar to navigate to different sections like Attendance, Courses, Students, Marks, and Schedule.
      </p>

      {/* Optional: Add dashboard stats or widgets here */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-700">Today’s Attendance</h2>
          <p className="text-gray-600 mt-2">Mark attendance for your scheduled classes today.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-700">Upcoming Schedule</h2>
          <p className="text-gray-600 mt-2">Check your upcoming classes and events.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
