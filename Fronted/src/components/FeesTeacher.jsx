import axios from "axios";
import { useEffect, useState } from "react";
import ColorReceipt from "./ColorReceipt";
import { ClipLoader } from "react-spinners";
const FeesTeacher = () => {
  const [data, setData] = useState([]);

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/feeDetails")
      .then((res) => {
        setData(res.data);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        alert("failed to load the data");
      });
  }, []);

  const [id, setId] = useState("");
  const [receipt, ShowReceipt] = useState(false);

  const HandleClick = (id) => {
    console.log(id);
    setId(id);
    ShowReceipt(true);
  };
  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#040505" size={40} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <h1 className="flex justify-center items-center text-3xl font-bold">
          No Student
        </h1>
      </>
    );
  }
  return (
    <>
      {!receipt && (
        <>
          <p className="font-bold flex justify-center items-center text-xl mb-4">
            List Of All Students
          </p>
          <div className="overflow-x-auto py-5">
            <table className="table-auto border-collapse border border-gray-400 w-full text-center">
              <thead className="bg-gray-300">
                <tr>
                  <th className="border px-4 py-2">Roll Number</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Branch</th>
                  <th className="border px-4 py-2">Mobile No.</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2 max-w-[150px] break-words whitespace-normal">
                    Transaction Id
                  </th>

                  <th className="border px-4 py-2">Date of Submission</th>
                  <th className="border px-4 py-2">Show Receit</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const student = item.studentsDetails?.[0] || {};
                  {
                    if (student.name)
                      return (
                        <tr key={index}>
                          <td className="border px-3 py-2">
                            {item.rollNumber}
                          </td>
                          <td className="border px-3 py-2">
                            {student.name || "N/A"}
                          </td>
                          <td className="border px-3 py-2">
                            {student.department || "N/A"}
                          </td>
                          <td className="border px-3 py-2">
                            {student.phone || "N/A"}
                          </td>
                          <td className="border px-3 py-2">{item.amount}</td>
                          <td className="border px-3 w-2 py-2 max-w-[200px] break-words whitespace-normal">
                            {item.transactionId}
                          </td>
                          <td className="border px-3 py-2">
                            {new Date(item.submittedAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>
                          <td className="border px-3 py-2 max-w-[200px] break-words whitespace-normal">
                            <button
                              className="cursor-pointer bg-green-500 w-20 h-8 rounded-lg hover:bg-green-700 "
                              onClick={() => HandleClick(item.transactionId)}
                            >
                              See
                            </button>
                          </td>
                        </tr>
                      );
                  }
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {receipt && (
        <>
          <ColorReceipt id={id}></ColorReceipt>
        </>
      )}
    </>
  );
};

export default FeesTeacher;
