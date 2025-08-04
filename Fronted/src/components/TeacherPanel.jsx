import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaUserGraduate } from 'react-icons/fa';
import TeacherSidebar from './TeacherSidebar';

const TeacherPanel = () => {
  const [students, setStudents] = useState([]);
  const [dialog, setDialog] = useState({ visible: false, studentId: null, type: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      const pending = res.data.filter((s) => s.status === 'pending');
      setStudents(pending);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const approveStudent = async (id) => {
    try {
      setIsLoading(true); // ✅ prevent multiple clicks
      await axios.put(`http://localhost:5000/api/students/${id}/approve`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setDialog({ visible: false, studentId: null, type: null }); // ✅ close dialog
    } catch (err) {
      console.error('Error approving student:', err);
    } finally {
      setIsLoading(false); // ✅ reset loading
    }
  };

  const rejectStudent = async () => {
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:5000/api/students/${dialog.studentId}/reject`, {
        reason: rejectionReason,
      });
      setStudents((prev) => prev.filter((s) => s._id !== dialog.studentId));
      setDialog({ visible: false, studentId: null, type: null });
      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting student:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <FaUserGraduate /> Student Approval Panel
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-500">No student registration requests.</p>
          ) : (
            <ul className="space-y-4">
              {students.map((student) => (
                <li key={student._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {student.photo && (
                      <img
                        src={`http://localhost:5000/uploads/${student.photo}`}
                        alt="Student"
                        className="w-32 h-32 rounded border object-cover shadow"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-purple-700">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {student.course} - {student.department} - Semester {student.semester}
                      </p>
                      <p className="text-sm text-gray-500">Email: {student.email}</p>
                      <p className="text-sm text-gray-500">
                        Hostel Requested: {student.hostelRequested ? 'Yes' : 'No'}
                      </p>
                      <p className="text-sm text-blue-600">Status: {student.status || 'pending'}</p>

                      {student.tenthMarksheet && (
                        <div className="text-sm mt-1">
                          <a
                            href={`http://localhost:5000/uploads/${student.tenthMarksheet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 mr-3"
                          >
                            📄 View 10th Marksheet
                          </a>
                          <a
                            href={`http://localhost:5000/uploads/${student.tenthMarksheet}`}
                            download
                            className="text-green-600 hover:text-green-800"
                          >
                            ⬇️ Download
                          </a>
                        </div>
                      )}
                      {student.twelfthMarksheet && (
                        <div className="text-sm mt-1">
                          <a
                            href={`http://localhost:5000/uploads/${student.twelfthMarksheet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 mr-3"
                          >
                            📄 View 12th Marksheet
                          </a>
                          <a
                            href={`http://localhost:5000/uploads/${student.twelfthMarksheet}`}
                            download
                            className="text-green-600 hover:text-green-800"
                          >
                            ⬇️ Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0 flex gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      onClick={() => setDialog({ visible: true, studentId: student._id, type: 'approve' })}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      onClick={() => setDialog({ visible: true, studentId: student._id, type: 'reject' })}
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {dialog.visible && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white border border-purple-300 p-6 rounded-xl shadow-2xl w-96">
              {dialog.type === 'reject' ? (
                <>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">Rejection Reason</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                    rows={4}
                    placeholder="Please write the reason for rejection"
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setDialog({ visible: false, studentId: null, type: null })}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!rejectionReason.trim() || isLoading}
                      className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={rejectStudent}
                    >
                      Submit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Confirm Approval</h3>
                  <p className="mb-4">Are you sure you want to approve this student?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setDialog({ visible: false, studentId: null, type: null })}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => approveStudent(dialog.studentId)}
                    >
                      Approve
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherPanel;
