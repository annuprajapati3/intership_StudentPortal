import { useEffect, useState } from "react";
import axios from "axios";
import ColorReceipt from "./ColorReceipt";

const Fees = () => {
  const TotalFees = {
    Tuition: 100000,
    Library: 5000,
    Medical: 1000,
    Student_Service: 5000,
    Energy_Fees: 10000,
    Insurance: 10000,
    Museum: 6000,
    Funds: 500,
    Social: 200,
    Development: 2000,
    Exam: 5000,
    ID: 50,
  };

  const total = Object.values(TotalFees).reduce((acc, val) => acc + val, 0);

  const [rollNumber, setRollNumber] = useState("");
  const [txnId, setTxnId] = useState("");
  const [QR, setQR] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [showFeesTable, setShowFeesTable] = useState(false);
  const [backlogCount, setBacklogCount] = useState(0);
  const [finecount , setfinecount] = useState(0);
  const [fines, setFines] = useState([]);
  const handleShowFees = () => {
    if (!rollNumber.trim()) {
      alert("Please enter Roll Number first.");
      return;
    }

    // Call marks API to calculate backlogs
    axios.get(`http://localhost:5000/api/${rollNumber}`).then((res) => {
      const marksData = res.data.marks; // Access marks field

      let count = 0;
      const passingMarks = 30;

      // Loop through semesters
      Object.keys(marksData).forEach((semester) => {
        const subjects = marksData[semester];
        Object.keys(subjects).forEach((subject) => {
          if (parseInt(subjects[subject]) < passingMarks) {
            count++;
          }
        });
      });

      setBacklogCount(count);
    });
    axios
      .get(`http://localhost:5000/api/academic_fines/${rollNumber}`)
      .then((res) => setFines(res.data.fines));
    setShowFeesTable(true);

  };

  const handleGetQR = () => {
    axios
      .get(`http://localhost:5000/api/qr?amount=${total}`)
      .then((res) => {
        setQR(res.data);
        setShowQR(true);
      })
      .catch((err) => console.log(err));
  };

 
  
  useEffect(()=>{
    let sum = 0;
    fines.map((i)=>{
      sum = sum + i.amount;
    })
    setfinecount(sum)
  } ,[setfinecount , fines])
  const handleShowReceipt = () => setReceipt(true);
  const backlogFee = backlogCount * 500;
  const finalTotal = total + backlogFee +finecount;
 const handleSubmitPayment = () => {
    if (txnId.length < 10 || txnId.length > 15) {
      alert("Transaction ID must be between 10-15 digits!");
      return;
    }

    axios
      .post("http://localhost:5000/api/transcation", {
        amount: finalTotal,
        transactionId: txnId,
        rollNumber,
      })
      .then(() => setSubmitted(true))
      .catch(() => alert("Please ensure your details are correct."));
  };
  return (
    <div className="flex flex-col items-center p-6 max-w-full bg-gradient-to-br from-blue-100 to-purple-200">
      {!showFeesTable && !showQR && !submitted && !receipt && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Enter Roll Number to View Fees
          </h1>

          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="border px-4 py-2 rounded-md mb-4 w-80"
          />

          <button
            onClick={handleShowFees}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            View Fees
          </button>
        </>
      )}

      {showFeesTable && !showQR && !submitted && !receipt && (
        <>
          <p className="flex justify-center items-center font-bold text-2xl p-5">
            Fees Summary
          </p>

          <div className="flex justify-center items-center overflow-x-auto w-full">
            <div className="min-w-[900px]">
              <table className="border-collapse border border-gray-300 bg-white shadow-md rounded-lg w-full">
                <tbody>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-2 font-semibold">Tuition</td>
                    <td className="px-10 py-2"></td>
                    <td className="px-10 py-2 font-semibold">
                      {TotalFees.Tuition}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-10 py-1">Tuition</td>
                    <td className="px-10 py-1">{TotalFees.Tuition}</td>
                    <td className="px-10 py-1"></td>
                  </tr>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-1 font-semibold">Miscellaneous</td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">
                      {TotalFees.Library +
                        TotalFees.Medical +
                        TotalFees.Student_Service +
                        TotalFees.Energy_Fees +
                        TotalFees.Insurance +
                        TotalFees.Museum}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-10 py-1">Library</td>
                    <td className="px-10 py-1">{TotalFees.Library}</td>
                    <td className="px-10 py-1"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Medical</td>
                    <td className="px-10">{TotalFees.Medical}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Student Service</td>
                    <td className="px-10">{TotalFees.Student_Service}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Energy Fees</td>
                    <td className="px-10">{TotalFees.Energy_Fees}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Insurance</td>
                    <td className="px-10">{TotalFees.Insurance}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Museum</td>
                    <td className="px-10">{TotalFees.Museum}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-1 font-semibold">Special Fees</td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">
                      {TotalFees.Funds + TotalFees.Social}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-10">Social Action Fees</td>
                    <td className="px-10">{TotalFees.Social}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr>
                    <td className="px-10">Achiever Funds</td>
                    <td className="px-10">{TotalFees.Funds}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-1 font-semibold">
                      Development Fees
                    </td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">
                      {TotalFees.Development}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-10">Development Fees</td>
                    <td className="px-10">{TotalFees.Development}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-1 font-semibold">Exam Fees</td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">
                      {TotalFees.Exam}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-10">Exam Fees</td>
                    <td className="px-10">{TotalFees.Exam}</td>
                    <td className="px-10"></td>
                  </tr>
                  <tr className="bg-gray-300">
                    <td className="px-10 py-1 font-semibold">ID Validation</td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">{TotalFees.ID}</td>
                  </tr>
                  <tr>
                    <td className="px-10">ID Validation</td>
                    <td className="px-10">{TotalFees.ID}</td>
                    <td className="px-10"></td>
                  </tr>
                  {backlogCount > 0 && (
                    <>
                    <tr className="bg-red-300">
                    <td className="px-10 py-1 font-semibold">BackLog</td>
                    <td className="px-10 py-1"></td>
                    <td className="px-10 py-1 font-semibold">{backlogFee} ({backlogCount}*500)</td>
                  </tr>
                  <tr>
                    <td className="px-10">No. of Backlog</td>
                    <td className="px-10">{backlogCount}</td>
                    <td className="px-10"></td>
                  </tr>
                  </>
                  )}
                  {fines.length !== 0 && (
  <>
    <tr className="bg-red-300">
      <td className="px-10 py-1 font-semibold">Academic Fines</td>
      <td className="px-10 py-1"></td>
      <td className="px-10 py-1 font-semibold">{finecount}</td>
    </tr>
    {fines.map((i, index) => (
      <tr key={index}>
        <td className="px-10">{i.type}</td>
        <td className="px-10">{i.amount}</td>
        <td className="px-10"></td>
      </tr>
    ))}
  </>
)}

                  <tr className="bg-gray-400 mt-4">
                    <td className="px-10 py-3 font-bold text-lg">Total Fees</td>
                    <td className="px-10 py-3 font-bold"></td>
                    <td className="px-10 py-3 font-bold text-lg">
                      {finalTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6">
            <button
              className="p-3 cursor-pointer rounded-lg bg-purple-500 text-xl font-semibold w-44"
              onClick={handleGetQR}
            >
              Pay Now
            </button>
          </div>
        </>
      )}

      {showQR && !submitted && !receipt && (
        <div className="flex flex-col justify-center items-center p-7">
          <img src={QR} alt="QR Code" className="w-40 h-40 mb-4" />

          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className="border px-4 py-2 rounded-md mb-3 w-80"
          />

          <button
            className="p-3 bg-purple-500 rounded-lg text-xl font-semibold w-40 cursor-pointer"
            onClick={handleSubmitPayment}
          >
            Submit
          </button>
        </div>
      )}

      {submitted && !receipt && (
        <div className="flex flex-col items-center p-7">
          <p className="text-lg font-bold text-green-500 mb-4">
            Your Fees INR {total} is successfully submitted
          </p>
          <button
            className="bg-purple-400 w-35 rounded-lg h-10 px-4 py-2 text-white"
            onClick={handleShowReceipt}
          >
            See Receipt
          </button>
        </div>
      )}

      {receipt && (
        <div className="w-full">
          <ColorReceipt id={txnId} backlog = {backlogFee} fine={finecount} total={finalTotal} />
        </div>
      )}
    </div>
  );
};

export default Fees;
