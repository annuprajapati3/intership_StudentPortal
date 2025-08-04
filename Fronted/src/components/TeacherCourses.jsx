import React, { useEffect, useState } from "react";
import axios from "axios";

const subjectInfoMap = {
  "DSA": { teacher: "Dr. Sharma", topics: ["Arrays", "Trees", "Graphs"] },
  "DBMS": { teacher: "Prof. Mehta", topics: ["ER Model", "SQL", "Transactions"] },
  "Operating Systems": { teacher: "Ms. Kaur", topics: ["Processes", "Memory", "Deadlock"] },
  "Computer Networks": { teacher: "Mr. Verma", topics: ["OSI Model", "TCP/IP", "Routing"] },
  "C Programming": { teacher: "Ms. Joshi", topics: ["Loops", "Pointers", "Functions"] },
  "Java": { teacher: "Mr. Sen", topics: ["OOP", "Inheritance", "JVM"] },
  "Web Development": { teacher: "Ms. Dutta", topics: ["HTML", "CSS", "JavaScript"] },
  "Maths": { teacher: "Dr. Rao", topics: ["Calculus", "Algebra", "Statistics"] },
  "Physics": { teacher: "Dr. Iyer", topics: ["Kinematics", "Thermodynamics", "Optics"] },
  "Chemistry": { teacher: "Dr. Singh", topics: ["Organic", "Inorganic", "Physical"] },
  "Basic IT": { teacher: "Mr. Anand", topics: ["MS Office", "Basics of OS", "Internet"] },
  "English": { teacher: "Ms. Roy", topics: ["Grammar", "Communication", "Writing"] },
  "Computer Fundamentals": { teacher: "Mr. Kumar", topics: ["Hardware", "Software", "Binary Numbers"] }
};

const TeacherCourses = () => {
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
  axios.get("http://localhost:5000/api/")
    .then(res => setStudents(res.data.reverse()))
    .catch(err => console.error(err));
}, []);


  const allCourses =["B.Tech", "BCA", "B.Sc", "Diploma"]  ;

  const filteredStudents = selectedCourse
    ? students.filter(student => student.course === selectedCourse)
    : students;

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handlePageChange = (direction) => {
    setExpandedIndex(null); // Close any open cards
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Course & Subject Details</h1>

      <div className="mb-4 flex gap-4 items-center">
        <label className="font-medium">Filter by Course:</label>
        <select
          className="border px-4 py-2 rounded-md"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setCurrentPage(1); 
          }}
        >
          <option value="">All Courses</option>
          {allCourses.map((course, i) => (
            <option key={i} value={course}>{course}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-gray-700 font-medium">
        Total Students: {filteredStudents.length}
      </p>

      {currentStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        currentStudents.map((student, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 my-4 border cursor-pointer"
            onClick={() => toggleExpand(index)}
          >
            <h2 className="text-lg font-semibold mb-1">Roll No: {student.rollNo}</h2>
            <p className="mb-1"><strong>Marks:</strong> {student.marks}</p>
            <p><strong>Course:</strong> {student.course}</p>

            {expandedIndex === index && (
              <div className="mt-4">
                <p className="font-medium mb-1">Subjects:</p>
                <div className="ml-4 space-y-3">
                  {(student.subjects || []).map((subjectName, idx) => {
                    const info = subjectInfoMap[subjectName] || {};
                    return (
                      <div key={idx} className="p-3 bg-gray-50 rounded-md border">
                        <p><strong>Name:</strong> {subjectName}</p>
                        <p><strong>Teacher:</strong> {info.teacher || "N/A"}</p>
                        <p><strong>Topics:</strong></p>
                        <ul className="list-disc ml-5 text-sm text-gray-700">
                          {(info.topics || []).map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
