import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCheck } from 'react-icons/fa';

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateError, setDateError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [unmarkedRollNumbers, setUnmarkedRollNumbers] = useState([]);
  const [summaryDialog, setSummaryDialog] = useState(false);
  const [summaryCounts, setSummaryCounts] = useState({ present: 0, absent: 0 });

  useEffect(() => {
    const fetchApprovedStudents = async () => {
      try {
        const studentRes = await axios.get('http://localhost:5000/api/students?approved=true');
        const sorted = studentRes.data.sort((a, b) =>
          (a.rollNumber || '').localeCompare(b.rollNumber || '')
        );
        setStudents(sorted);

        const attendanceRes = await axios.get(`http://localhost:5000/api/attendance/by-date/${selectedDate}`);
        const attendanceMap = {};
        attendanceRes.data.forEach((rec) => {
          attendanceMap[rec.studentId._id] = rec.status;
        });

        const initial = {};
        sorted.forEach((s) => {
          if (attendanceMap[s._id] !== undefined) {
            initial[s._id] = attendanceMap[s._id];
          }
        });

        setAttendance(initial);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchApprovedStudents();
  }, [selectedDate]);

  const handleChange = (id, value) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  const isDateValid = (dateStr) => {
    const selected = new Date(dateStr);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected.getTime() === today.getTime();
  };

  const handleSubmit = () => {
    if (!isDateValid(selectedDate)) {
      setDateError('Attendance can only be marked for today.');
      return;
    }

    const unmarkedStudents = students.filter(student => attendance[student._id] === undefined);

    if (unmarkedStudents.length > 0) {
      setUnmarkedRollNumbers(unmarkedStudents.map(s => s.rollNumber));
      setShowDialog(true);
      return;
    }

    const presentCount = Object.values(attendance).filter(val => val === 'present').length;
    const absentCount = Object.values(attendance).filter(val => val === 'absent').length;

    setSummaryCounts({ present: presentCount, absent: absentCount });
    setSummaryDialog(true); // Show confirmation dialog
  };

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  return (
    <main className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
          <FaUserCheck /> Mark Attendance
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            min={todayStr}
            max={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
          {dateError && <p className="text-red-600 text-sm mt-1">{dateError}</p>}
        </div>

        {students.length === 0 ? (
          <p className="text-gray-500">No approved students available.</p>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-purple-700">Roll No: {student.rollNumber}</p>
                  {attendance[student._id] === undefined && (
                    <p className="text-red-600 text-sm">* Attendance not marked</p>
                  )}
                </div>
                <select
                  value={attendance[student._id] || ''}
                  onChange={(e) => handleChange(student._id, e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="">--Select--</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow"
            >
              Submit Attendance
            </button>
          </form>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-red-700">Unmarked Attendance</h3>
            <p className="mb-4">Please mark attendance for the following roll numbers:</p>
            <ul className="list-disc list-inside text-sm mb-4 text-gray-700">
              {unmarkedRollNumbers.map((roll, idx) => (
                <li key={idx}>{roll}</li>
              ))}
            </ul>
            <button
              onClick={() => setShowDialog(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {summaryDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3 text-purple-700">Confirm Attendance</h3>
            <p className="text-gray-700 mb-2">Are you sure you want to submit?</p>
            <div className="flex justify-between mb-4 text-sm font-medium">
              <p className="text-green-600">Present: {summaryCounts.present}</p>
              <p className="text-red-600">Absent: {summaryCounts.absent}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSummaryDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const records = students.map((student) => ({
                      studentId: student._id,
                      rollNumber: student.rollNumber,
                      status: attendance[student._id],
                    }));

                    await axios.post('http://localhost:5000/api/attendance/mark', {
                      date: selectedDate,
                      records,
                    });

                    setSummaryDialog(false);
                    alert('✅ Attendance submitted successfully!');
                  } catch (err) {
                    console.error('Error submitting attendance:', err);
                    if (err.response?.status === 409) {
                      alert('⚠️ Attendance for this date is already marked.');
                    } else {
                      alert('❌ Failed to submit attendance.');
                    }
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AttendancePage;
