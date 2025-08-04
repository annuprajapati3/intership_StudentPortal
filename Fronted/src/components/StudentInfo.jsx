import axios from "axios";
import { useEffect, useState } from "react";

const StudentInfo = () => {
  const [student, setStudent] = useState([]);
  const [selected, setSelected] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [marksData, setMarksData] = useState({});
  const [semester, setSemester] = useState("");
  const [finalmarks , setFinalMarks] = useState(false);
  const subjects = ["sub1", "sub2", "sub3", "sub4", "sub5"];

  const [subjectMarks, setSubjectMarks] = useState({
    sub1: "",
    sub2: "",
    sub3: "",
    sub4: "",
    sub5: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students/")
      .then((res) => setStudent(res.data))
      .catch(() => console.log("Error fetching students"));
  }, []);

  const selectedStudent = student.find((item) => item.rollNumber === rollNo);

  const handleSelectChange = (e) => {
    setRollNo(e.target.value);
    setMarksData({});
    setSelected(false);
  };

  const handleSubjectChange = (subject, value) => {
    if (value < 0 || value > 100) {
      return alert(
        `Marks enter for ${subject} is invalid . Please enter valid marks\n valid marks should be :  0 <=marks <=100`
      );
    }
    setSubjectMarks((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  const handleAddMarks = () => {
    if (semester === "") {
      alert("Please select semester");
      return;
    }
    for (let subj of subjects) {
      if (subjectMarks[subj] === "") {
        alert(`Please enter marks for ${subj}`);
        return;
      }
    }
    alert(
      `Ensure that you have entered the correct marks of semester :  ${semester}\n sub1 : ${subjectMarks.sub1} \n sub2 : ${subjectMarks.sub2} \n sub3 : ${subjectMarks.sub3} \n sub4 : ${subjectMarks.sub4} \n sub5 : ${subjectMarks.sub5}`
    );
    setMarksData((prev) => ({
      ...prev,
      [semester]: subjectMarks,
    }));
    setSemester("");
    setSubjectMarks({
      sub1: "",
      sub2: "",
      sub3: "",
      sub4: "",
      sub5: "",
    });
  };

  
 

const handleFinalSubmit = async () => {
    const payload = {
        rollNo,
        marks: marksData,
    };

    try {
        const res = await axios.post("http://localhost:5000/api/add", payload);
        console.log("Server Response:", res.data);
        alert("Marks submitted successfully!");

        setSelected(false);
        setFinalMarks(false);
        setRollNo("");
    } catch (err) {
        console.error("Error submitting marks:", err);
        alert("Failed to submit marks. Please try again.");
    }
};


  const totalSemesters = selectedStudent ? selectedStudent.semester : 0;
  const remainingSemesters = selectedStudent
    ? Array.from({ length: totalSemesters }, (_, i) =>
        (i + 1).toString()
      ).filter((sem) => !marksData[sem])
    : [];
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      

      {!selected && !finalmarks &&(
        <>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Select Student
      </h2>
          <div className="mb-4">
            <label
              htmlFor="rollNo"
              className="block text-gray-700 font-semibold mb-2"
            >
              Select Student:
            </label>
            <select
              name="rollNo"
              id="rollNo"
              value={rollNo}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Student</option>
              {student.map(
                (item, idx) =>
                  item.status === "approved" && (
                    <option value={item.rollNumber} key={idx}>
                      {item.rollNumber} - {item.name}
                    </option>
                  )
              )}
            </select>
          </div>

          {rollNo && selectedStudent && (
            <>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Student Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">Roll No:</span>{" "}
                  {selectedStudent.rollNumber}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">Name:</span>{" "}
                  {selectedStudent.name}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">Mobile:</span>{" "}
                  {selectedStudent.phone}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  {selectedStudent.email}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">
                    Department:
                  </span>{" "}
                  {selectedStudent.department}
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-gray-700">Semester:</span>{" "}
                  {selectedStudent.semester}
                </p>
              </div>

              <button
                onClick={() => setSelected(true)}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Upload Marks
              </button>
            </>
          )}
        </>
      )}

      {selected && !finalmarks &&(
        <>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Upload Student Marks
      </h2>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Enter Semester-wise Marks
          </h3>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Select Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full p-2 border rounded-lg "
            >
              <option value="">Select Semester</option>
              {remainingSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full mb-4 border text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => (
                <tr key={subj}>
                  <td className="border px-4 py-2">{subj}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={subjectMarks[subj]}
                      onChange={(e) =>
                        handleSubjectChange(subj, e.target.value)
                      }
                      className="w-full p-1 bg-gray-300 rounded-lg"
                      placeholder="Marks"
                      min="0"
                      max="100"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAddMarks}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-4"
          >
            Add Semester Marks
          </button>
          {remainingSemesters.length==0 && (
            <button className="w-full bg-blue-400   font-semibold py-2 px-4 rounded-lg transition duration-300 mb-4" onClick={()=>setFinalMarks(true)}>Submit</button>
          )}
          
        </>
        
      )}
       {selected && finalmarks && (
        <>
           {console.log(marksData)}
          {selected && finalmarks && (
        <>
           {console.log(marksData)}
          <div >
<h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Preview
      </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-200 p-4">
                {Object.entries(marksData).map(([sem, subjects]) => (
                    <div 
                        key={sem} 
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            📘 Semester {sem}
                        </h3>
                        <ul className="space-y-2">
                            {Object.entries(subjects).map(([sub, mark]) => (
                                <li key={sub} className="flex justify-between text-gray-700">
                                    <span className="font-medium capitalize">{sub}</span>
                                    <span className="font-bold text-blue-600">{mark}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <button className="bg-green-500 w-full mt-5 cursor-pointer rounded-lg h-10" onClick={()=>handleFinalSubmit()}>Update Marks</button>
        </div>
        </>
       )}
        </>
       )}
    </div>
  );
};

export default StudentInfo;
