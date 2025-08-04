import { useState } from "react";

const courseMap = [
  { min: 90, courses: ["B.Tech", "BCA", "B.Sc", "Diploma"] },
  { min: 75, courses: ["BCA", "B.Sc", "Diploma"] },
  { min: 60, courses: ["B.Sc", "Diploma"] },
  { min: 50, courses: ["Diploma"] }
];

const subjectMap = {
  "B.Tech": [
    { name: "DSA", teacher: "Dr. Sharma", topics: ["Arrays", "Trees", "Graphs"] },
    { name: "DBMS", teacher: "Prof. Mehta", topics: ["ER Model", "SQL", "Transactions"] },
    { name: "Operating Systems", teacher: "Ms. Kaur", topics: ["Processes", "Memory", "Deadlock"] },
    { name: "Computer Networks", teacher: "Mr. Verma", topics: ["OSI Model", "TCP/IP", "Routing"] }
  ],
  "BCA": [
    { name: "C Programming", teacher: "Ms. Joshi", topics: ["Loops", "Pointers", "Functions"] },
    { name: "Java", teacher: "Mr. Sen", topics: ["OOP", "Inheritance", "JVM"] },
    { name: "Web Development", teacher: "Ms. Dutta", topics: ["HTML", "CSS", "JavaScript"] }
  ],
  "B.Sc": [
    { name: "Maths", teacher: "Dr. Rao", topics: ["Calculus", "Algebra", "Statistics"] },
    { name: "Physics", teacher: "Dr. Iyer", topics: ["Kinematics", "Thermodynamics", "Optics"] },
    { name: "Chemistry", teacher: "Dr. Singh", topics: ["Organic", "Inorganic", "Physical"] }
  ],
  "Diploma": [
    { name: "Basic IT", teacher: "Mr. Anand", topics: ["MS Office", "Basics of OS", "Internet"] },
    { name: "English", teacher: "Ms. Roy", topics: ["Grammar", "Communication", "Writing"] },
    { name: "Computer Fundamentals", teacher: "Mr. Kumar", topics: ["Hardware", "Software", "Binary Numbers"] }
  ]
};

export default function CourseSelector() {
  const [marks, setMarks] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleMarksChange = (e) => {
    const value = parseInt(e.target.value);
    if(value<0 || value>100){
      return alert("Enter valid marks !!")
    }
    
    setMarks(e.target.value);
    setSelectedCourse("");
    setAvailableSubjects([]);
    setSelectedSubjects([]);
    setShowModal(false);
    setShowMessage(false);

    if (!isNaN(value)) {
      if (value < 50) {
        setAvailableCourses([]);
        setShowMessage(true);
      } else {
        const courseGroup = courseMap.find(group => value >= group.min);
        setAvailableCourses(courseGroup ? courseGroup.courses : []);
      }
    } else {
      setAvailableCourses([]);
    }
  };

  const handleCourseSelect = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    setAvailableSubjects(subjectMap[course] || []);
    setSelectedSubjects([]);
    setShowModal(false);
  };

  const toggleSubject = (subjectName) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectName)
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  const handleSubmit = () => {
    if (!rollNo.trim()) {
      alert("Please enter your roll number.");
      return;
    }

    if (!selectedCourse || selectedSubjects.length === 0) {
      alert("Please select a course and at least one subject.");
      return;
    }

    console.log("Roll Number:", rollNo);
    console.log("Selected Course:", selectedCourse);
    console.log("Selected Subjects:", selectedSubjects);
    setShowModal(true);
  };

  const handleEdit = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rollNo: rollNo.trim(),
          marks: parseInt(marks),
          course: selectedCourse,
          subjects: selectedSubjects
        })
      });
      alert("Your subject is successfully saved");
      const data = await response.json();
      console.log("Server Response:", data);

      // reset
      setMarks("");
      setRollNo("");
      setSelectedCourse("");
      setAvailableCourses([]);
      setAvailableSubjects([]);
      setSelectedSubjects([]);
      setShowModal(false);
      setShowMessage(false);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md ">
      {!showModal && (
        <>
        <h2 className="text-2xl font-bold mb-4">Course and Subject Selection</h2>

      <label className="block mb-2 font-medium">Enter Roll Number:</label>
      <input
        type="text"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
        placeholder="Enter Roll Number"
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Enter your marks:</label>
      <input
        type="number"
        value={marks}
        onChange={handleMarksChange}
        placeholder="Enter marks (0-100)"
        className="w-full p-2 border rounded mb-4"
      />

      {showMessage && (
        <p className="text-red-600 font-semibold mb-4">
          You are not eligible for any course.
        </p>
      )}

      {availableCourses.length > 0 && (
        <>
          <label className="block mb-2 font-medium">Select Course:</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedCourse}
            onChange={handleCourseSelect}
          >
            <option value="">-- Select Course --</option>
            {availableCourses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </>
      )}

      {availableSubjects.length > 0 && (
        <>
          <label className="block mb-2 font-medium">Select Subjects:</label>
          <div className="space-y-4 mb-4">
            {availableSubjects.map((subject, index) => (
              <div key={index} className="border p-3 rounded-md bg-gray-50 shadow-sm">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id={subject.name}
                    checked={selectedSubjects.includes(subject.name)}
                    onChange={() => toggleSubject(subject.name)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor={subject.name} className="font-medium text-lg">
                      {subject.name}
                    </label>
                    <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
                    <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                      {subject.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </>
      )}
        </>
      )}
      

      {showModal && (
        <div className=" bg-white border border-gray-300 shadow-lg p-6 rounded-lg z-50 ">
          <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
          <p className="mb-2"><strong>Roll No:</strong> {rollNo}</p>
          <p className="mb-2"><strong>Course:</strong> {selectedCourse}</p>
          <p><strong>Subjects:</strong></p>
          <ul className="list-disc ml-6 text-sm text-gray-700 mt-1">
            {availableSubjects
              .filter(sub => selectedSubjects.includes(sub.name))
              .map((subject, index) => (
                <li key={index}>
                  <strong>{subject.name}</strong> - {subject.teacher}
                  <ul className="list-circle ml-6 text-xs mt-1">
                    {subject.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handleEdit}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
