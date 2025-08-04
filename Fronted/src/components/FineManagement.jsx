import { useState } from "react";
import axios from "axios";

const FineManagement = () => {
    const [rollNo, setRollNo] = useState("");
    const [fineType, setFineType] = useState("");
    const [fineAmount, setFineAmount] = useState("");
    const [fineList, setFineList] = useState([]);
    const [reviewMode, setReviewMode] = useState(false); // to show summary before final submit

    const fineOptions = [
        "Late Fee",
        "Library Fine",
        "Discipline Fine",
        "Hostel Fine",
        "Mess Fine"
    ];

    const handleAddFine = () => {
        if (fineType && fineAmount) {
            setFineList([...fineList, { type: fineType, amount: fineAmount }]);
            setFineType("");
            setFineAmount("");
        }
    };

    const handleRemoveFine = (index) => {
        const updatedList = [...fineList];
        updatedList.splice(index, 1);
        setFineList(updatedList);
    };

    const handleReview = () => {
        if (rollNo.trim() !== "" && fineList.length > 0) {
            setReviewMode(true);
        }
    };

   const handleFinalSubmit = async () => {
    const payload = {
        rollNo,
        fines: fineList,
    };

    try {
        const res = await axios.post("http://localhost:5000/api/fines", payload);
        console.log("Response from server:", res.data);

        // Reset after success
        setRollNo("");
        setFineList([]);
        setFineType("");
        setFineAmount("");
        setReviewMode(false);
        alert("Fines submitted successfully!");
    } catch (error) {
        console.error("Error submitting fines:", error);
        alert("Failed to submit fines");
    }
};


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-xl w-[400px]">
                {!reviewMode ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4 text-center">Add Fines to Student</h2>

                        <input
                            type="text"
                            placeholder="Enter Roll Number"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                            required
                        />

                        <select
                            value={fineType}
                            onChange={(e) => setFineType(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                        >
                            <option value="">Select Fine Type</option>
                            {fineOptions.map((fine, index) => (
                                <option key={index} value={fine}>{fine}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Enter Fine Amount (₹)"
                            value={fineAmount}
                            onChange={(e) => setFineAmount(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                            min="1"
                        />

                        <button
                            type="button"
                            onClick={handleAddFine}
                            className="w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600 transition"
                        >
                            Add Fine
                        </button>

                        {fineList.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Fines Added:</h3>
                                <ul className="space-y-2">
                                    {fineList.map((fine, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                        >
                                            <span>{fine.type} - ₹{fine.amount}</span>
                                            <button
                                                onClick={() => handleRemoveFine(index)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleReview}
                            disabled={fineList.length === 0 || rollNo.trim() === ""}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                        >
                            Review & Submit
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4 text-center">Review Fines</h2>
                        <p className="mb-2"><b>Roll No:</b> {rollNo}</p>
                        <ul className="mb-4">
                            {fineList.map((fine, index) => (
                                <li key={index} className="border-b py-2 flex justify-between">
                                    <span>{fine.type}</span>
                                    <span>₹{fine.amount}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleFinalSubmit}
                            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                        >
                            Submit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FineManagement;
