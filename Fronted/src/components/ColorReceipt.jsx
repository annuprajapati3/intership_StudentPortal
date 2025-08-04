import axios from "axios";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import sign from "../assets/sign.png";
import { ClipLoader } from "react-spinners";

const ColorReceipt = ({ id }) => {
  const receiptRef = useRef();

  const TotalFees = {
    Tuition: 100000,
    Library: 5000,
    Medical: 1000,
    Other: 38750,
  };

  const [stData, setStData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [backlogCount, setBacklogCount] = useState(0);
  const [fineCount, setFineCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/feeDetails")
      .then((res) => {
        setStData(res.data);
        setLoader(false);
      })
      .catch(() => {
        alert("Failed to get data");
        setLoader(false);
      });
  }, []);

  const currentReceipt = stData.find((item) => item.transactionId === id);

  useEffect(() => {
    if (!currentReceipt) return;
    const student = currentReceipt.studentsDetails[0];
    if (!student || !student.rollNumber) return;

    // Get backlogs
    axios
      .get(`http://localhost:5000/api/${student.rollNumber}`)
      .then((res) => {
        const marksData = res.data.marks;
        let count = 0;
        const passingMarks = 30;

        Object.keys(marksData).forEach((semester) => {
          const subjects = marksData[semester];
          Object.keys(subjects).forEach((subject) => {
            if (parseInt(subjects[subject]) < passingMarks) {
              count++;
            }
          });
        });

        setBacklogCount(count * 500); // Assume ₹500 per backlog
      });

    // Get fines
    axios
      .get(`http://localhost:5000/api/academic_fines/${student.rollNumber}`)
      .then((res) => {
        const totalFine = res.data.fines.reduce((acc, fine) => acc + fine.amount, 0);
        setFineCount(totalFine);
      });
  }, [currentReceipt]);

  const handleDownload = () => {
    html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(18);
      pdf.text("ABC Institute Fee Receipt", 15, 15);
      pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);

      const d = new Date();
      const name = `Fee_Receipt_${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.pdf`;
      pdf.save(name);
    });
  };

  if (loader || !currentReceipt) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#040505" size={40} />
      </div>
    );
  }

  const student = currentReceipt.studentsDetails[0];
  console.log(fineCount , backlogCount )
  const total = fineCount + backlogCount + 144750;
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        ref={receiptRef}
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          padding: "40px",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          border: "2px solid #ddd",
          position: "relative",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Watermark */}
        <p
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-20deg)",
            fontSize: "70px",
            color: "rgba(200,200,200,0.3)",
            fontWeight: "bold",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          ABC Institute
        </p>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          <img src={logo} alt="Institute Logo" style={{ width: "90px", marginRight: "30px" }} />
          <div style={{ textAlign: "left" }}>
            <h2 style={{ margin: "0", color: "#4B0082", fontSize: "24px" }}>
              ABC Institute of Technology
            </h2>
            <p style={{ margin: "2px 0", fontSize: "14px", color: "#777" }}>www.abcinstitute.com</p>
            <p style={{ margin: "2px 0", fontSize: "14px", color: "#777" }}>+91 9876543210</p>
          </div>
        </div>

        <h1 style={{ color: "#FFA500", textAlign: "center", margin: "20px 0", fontSize: "28px" }}>
          FEE RECEIPT
        </h1>

        {/* Student Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ textAlign: "left", fontSize: "16px" }}>
            <p><b>Student Name:</b> {student.name}</p>
            <p><b>Department:</b> {student.department}</p>
            <p><b>Roll No:</b> {student.rollNumber}</p>
          </div>
          <div style={{ textAlign: "left", fontSize: "16px" }}>
            <p><b>Receipt No:</b> {currentReceipt._id}</p>
            <p><b>Transaction ID:</b> {currentReceipt.transactionId}</p>
            <p><b>Date:</b> {new Date(currentReceipt.submittedAt).toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Fee Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr style={{ backgroundColor: "#FFD700", color: "#000", fontSize: "16px" }}>
              <th style={{ border: "1px solid #ccc", padding: "12px 20px" }}>Description</th>
              <th style={{ border: "1px solid #ccc", padding: "12px 20px" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(TotalFees).map(([key, value]) => (
              <tr key={key}>
                <td style={{ border: "1px solid #ccc", padding: "12px 20px", fontSize: "15px" }}>{key} Fee</td>
                <td style={{ border: "1px solid #ccc", padding: "12px 20px", fontSize: "15px" }}>{value}</td>
              </tr>
            ))}
            {backlogCount > 0 && (
              <tr>
                <td style={{ background: "#fa8072", border: "1px solid #ccc", padding: "12px 20px", fontWeight: "bold" }}>
                  Backlog
                </td>
                <td style={{ background: "#fa8072", border: "1px solid #ccc", padding: "12px 20px", fontWeight: "bold" }}>
                  {backlogCount}
                </td>
              </tr>
            )}
            {fineCount > 0 && (
              <tr>
                <td style={{ background: "#e6b0aa", border: "1px solid #ccc", padding: "12px 20px" }}>
                  Academic Fine
                </td>
                <td style={{ background: "#e6b0aa", border: "1px solid #ccc", padding: "12px 20px" }}>
                  {fineCount}
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: "#F0F8FF", fontWeight: "bold", fontSize: "16px" }}>
              <td style={{ border: "1px solid #ccc", padding: "12px 20px" }}>Amount Paid</td>
              <td style={{ border: "1px solid #ccc", padding: "12px 20px" }}>{total}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "13px", color: "#555" }}>
            Payment is non-refundable. Please keep this receipt safe.
          </div>
          <div style={{ textAlign: "center" }}>
            <img src={sign} alt="Signature" style={{ width: "120px" }} />
            <p style={{ marginTop: "5px", fontSize: "12px" }}>Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ marginTop: "25px" }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: "#4B0082",
            color: "#fff",
            padding: "12px 30px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default ColorReceipt;
