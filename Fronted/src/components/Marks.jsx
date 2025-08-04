import React, { useState } from "react";
import axios from "axios";
import { FaBookOpen, FaUserGraduate } from "react-icons/fa";

const Marks = () => {
    const [rollNo, setRollNo] = useState("");
    const [student, setStudent] = useState(null);
    const [marksData, setMarksData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setStudent(null);
        setMarksData(null);

        try {
            const res = await axios.get(`http://localhost:5000/api/${rollNo}`);
            setStudent(res.data);
            setMarksData(res.data.marks);
        } catch (err) {
            console.log(err);
            setError("Marks not found or invalid Roll Number.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-6">
            <div className="backdrop-blur-md bg-white/30 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-white/50">
                <h1 className="text-3xl font-extrabold text-purple-800 text-center mb-6">🎓 Student Marks Portal</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter Roll Number"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 shadow-md"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:scale-105 transform transition font-semibold shadow-lg"
                    >
                        Get Marks
                    </button>
                </form>

                {loading && <p className="mt-4 text-center text-gray-700">Loading...</p>}
                {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
            </div>

            {student && (
                <div className="mt-10 w-full max-w-5xl">
                    <div className="bg-white/40 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/50 mb-8 hover:shadow-2xl transition">
                        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <FaUserGraduate /> Student Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800 text-lg">
                            <p><b>Name:</b> {student.name}</p>
                            <p><b>Roll No:</b> {student.rollNo}</p>
                            <p><b>Course:</b> {student.course}</p>
                            <p><b>Department:</b> {student.department}</p>
                            <p><b>Semester:</b> {student.semester}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">📚 Semester Wise Marks</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(marksData).map(([sem, subjects]) => {
                            let backlogCount = 0;

                            return (
                                <div key={sem} className="bg-white/50 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/50 hover:scale-105 transform transition">
                                    <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
                                        <FaBookOpen /> Semester {sem}
                                    </h3>
                                    <ul className="space-y-2">
                                        {Object.entries(subjects).map(([sub, mark]) => {
                                            const isBacklog = parseInt(mark) < 32;
                                            if (isBacklog) backlogCount++;

                                            return (
                                                <li
                                                    key={sub}
                                                    className={`flex justify-between p-2 rounded-md ${isBacklog ? "bg-red-100 text-red-700 font-semibold" : "text-gray-700"}`}
                                                >
                                                    <span className="capitalize">{sub}</span>
                                                    <span>{mark}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <p className="mt-4 text-sm text-gray-800 font-medium">
                                        Total Backlogs: <span className={`font-bold ${backlogCount > 0 ? "text-red-600" : "text-green-700"}`}>{backlogCount}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marks;
