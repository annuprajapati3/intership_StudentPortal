import axios from "axios";
import sign from '../assets/sign.png';
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FeeReceipt = ({ id }) => {
  const receiptRef = useRef();
  const TotalFees = {
    Tutition: 100000,
    Libary: 5000,
    Medical: 1000,
    Student_Service: 5000,
    energy_fees: 10000,
    insureance: 10000,
    museum: 6000,
    funds: 500,
    social: 200,
    developmet: 2000,
    exam: 5000,
    id: 50
  };

  const [stData, SetstData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/feeDetails')
      .then((res) => {
        SetstData(res.data);
      })
      .catch(() => alert('Failed to get data'));
  }, []);

  const handleDownload = () => {
    html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Fee_Receipt.pdf");
    });
  };

  return (
    <>
      {stData.map((item) => {
        if (item.transactionId === id) {
          return (
            <div ref={receiptRef} className="p-5" >
              <div className="max-w-md mx-auto flex flex-col gap-3 justify-between items-center">
                <p className="text-2xl font-bold">ABC Institute of Technology</p>
                <p className="text-lg font-semibold">Official Fee Receipt</p>
              </div>

              <div style={{ height: "2px", backgroundColor: "#D1D5DB", margin: "10px 0" }}></div>

              <p className="ml-6 font-medium">Receipt No : {item._id}</p>
              <p className="ml-6 font-medium">Date of Submission : {(item.submittedAt).substring(0, 10)}</p>

              <div style={{ height: "2px", backgroundColor: "#D1D5DB", margin: "10px 0" }}></div>

              <p className="p-2 text-lg font-semibold">Student Details</p>
              <p className="ml-6">Name : {item.studentsDetails[0].name}</p>
              <p className="ml-6">Department : {item.studentsDetails[0].department}</p>
              <p className="ml-6">Roll No : {item.studentsDetails[0].rollNumber}</p>
              <p className="ml-6">Mobile No : {item.studentsDetails[0].phone}</p>

              <div style={{ height: "2px", backgroundColor: "#D1D5DB", margin: "10px 0" }}></div>

              <p className="p-2 text-lg font-semibold">Fee Details</p>

              <table className="table-auto w-full text-left" style={{ border: "1px solid #9CA3AF" }}>
                <thead style={{ backgroundColor: "#E5E7EB" }}>
                  <tr>
                    <th style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Particular</th>
                    <th style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Tuition Fee</td>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>{TotalFees.Tutition}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Library Fee</td>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>{TotalFees.Libary}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Medical Fee</td>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>{TotalFees.Medical}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Other Expenditure</td>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>38750</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>Amount Paid</td>
                    <td style={{ border: "1px solid #9CA3AF", padding: "8px" }}>{item.amount}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ height: "2px", backgroundColor: "#D1D5DB", margin: "10px 0" }}></div>

              <p className="p-4 text-lg font-medium">Transaction Id : {item.transactionId}</p>

              <div style={{ height: "2px", backgroundColor: "#D1D5DB", margin: "10px 0" }}></div>

              <p className="p-3 text-lg font-semibold">Authority Signature</p>
              <img className="h-20 w-40 overflow-hidden ml-6" src={sign} alt="Signature" />
            </div>
          );
        }
      })}

      <div className="flex justify-center items-center">
        <button
          onClick={handleDownload}
          className="w-50 bg-purple-500 rounded-lg h-10 font-semibold text-lg cursor-pointer mt-7 text-white px-4"
        >
          Download Receipt
        </button>
      </div>
    </>
  );
};

export default FeeReceipt;
