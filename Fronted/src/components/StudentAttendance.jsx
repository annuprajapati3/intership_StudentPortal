/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentAttendance = () => {
  const rollNumber = '2025400003'; // default student roll number
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/all');

      const filtered = res.data
        .filter(entry => {
          const entryDate = new Date(entry.date);
          const entryMonth = entryDate.toISOString().slice(0, 7);
          return entryMonth === month;
        })
        .flatMap(entry => {
          const date = new Date(entry.date).toISOString().slice(0, 10);
          const studentRecord = entry.records.find(rec => rec.rollNumber === rollNumber);
          return studentRecord
            ? [{ date, status: studentRecord.status.toLowerCase() }]
            : [];
        });

      setAttendanceData(filtered);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month]);

  const totalPresent = attendanceData.filter(a => a.status === 'present').length;
  const totalAbsent = attendanceData.filter(a => a.status === 'absent').length;
  const totalDays = attendanceData.length;
  const percentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

  return (
    <div className="p-4 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">My Monthly Attendance</h2>

      <label className="mb-4 block">
        Select Month:{' '}
        <input
          type="month"
          value={month}
          onChange={e => {
            setMonth(e.target.value);
            setViewDetails(false);
          }}
          max={new Date().toISOString().slice(0, 7)}
          className="border px-3 py-1 rounded ml-2"
        />
      </label>

      {totalDays === 0 ? (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded shadow mb-4">
          <strong>No attendance records found for the selected month.</strong><br />
          Reason: There were no classes due to semester break / holidays / exam schedule.
        </div>
      ) : (
        <>
          <div className="mb-4 bg-gray-100 p-4 rounded shadow-md">
            <p><strong>Total Days:</strong> {totalDays}</p>
            <p><strong>Present:</strong> {totalPresent}</p>
            <p><strong>Absent:</strong> {totalAbsent}</p>
            <p><strong>Attendance :</strong> {percentage}%</p>
          </div>

          {percentage < 75 && (
            <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded shadow-md">
              ⚠️ <strong>Alert:</strong> Your attendance is below 75%. Please ensure better attendance to meet eligibility requirements.
            </div>
          )}

          <button
            onClick={() => setViewDetails(!viewDetails)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
          >
            {viewDetails ? 'Hide Details' : 'View Details'}
          </button>

          {viewDetails && (
            <table className="border-collapse w-full text-sm">
              <thead>
                <tr>
                  <th className="border px-3 py-2 bg-gray-200">Date</th>
                  <th className="border px-3 py-2 bg-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2 text-center">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </td>
                    <td
                      className={`border px-3 py-2 text-center font-semibold ${
                        entry.status === 'present' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default StudentAttendance;
