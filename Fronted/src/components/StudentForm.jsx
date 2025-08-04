/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import ApplicationStatus from "./ApplicationStatus";

const StudentForm = () => {
  const [form, setForm] = useState({
    name: "",
    department: "",
    course: "",
    semester: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    hostelRequested: false,
  });

  const [marksheets, setMarksheets] = useState({
    tenth: null,
    twelfth: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(null);
  const [photo, setPhoto] = useState(null);

  const semesterOptions = {
    "B.Tech": 8,
    "M.Tech": 4,
    BCA: 6,
    MCA: 4,
    PhD: 10,
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setMessage("❌ Invalid file type. Only PDF, JPG, PNG, and WEBP allowed.");
      return false;
    }

    if (file.size > maxSize) {
      setMessage("❌ File too large. Maximum size is 5MB.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "course") {
      setForm((prev) => ({ ...prev, semester: "" }));
    }
  };

  const handleFileChange = (e) => {
  const { name, files } = e.target;
  const file = files[0];

  if (!file) return;

  // Validate photo separately
  if (name === "photo") {
    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      setMessage("❌ Only JPG/JPEG images are allowed for photo.");
      setPhoto(null);
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setMessage("❌ Photo too large. Max size is 1MB.");
      setPhoto(null);
      return;
    }
    setPhoto(file);
    return;
  }

  // For marksheets
  if (!validateFile(file)) {
    setMarksheets({
      ...marksheets,
      [name]: null,
    });
    return;
  }

  setMarksheets({
    ...marksheets,
    [name]: file,
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!form.name || !form.department || !form.semester || !form.course) {
        setMessage("❌ Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const dobDate = new Date(form.dob);
      const minDob = new Date("1990-01-01");
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      const ageValid = age > 18 || (age === 18 && m >= 0);

      if (dobDate < minDob || dobDate > today || !ageValid) {
        setMessage(
          "❌ Age must be at least 18 years and DOB between 01-01-1990 and today."
        );
        setLoading(false);
        return;
      }

      if (!marksheets.tenth || !marksheets.twelfth) {
        setMessage("❌ Please upload both 10th and 12th marksheets.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      formData.append("semester", Number(form.semester));
      formData.append("tenthMarksheet", marksheets.tenth);
      formData.append("twelfthMarksheet", marksheets.twelfth);
      formData.append("photo", photo);


      const res = await axios.post(
        "http://localhost:5000/api/students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Student registration submitted for approval!");
      setSubmittedEmail(form.email);

      setForm({
        name: "",
        department: "",
        course: "",
        semester: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        hostelRequested: false,
      });
      setMarksheets({ tenth: null, twelfth: null });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setMessage(
        `❌ ${err.response?.data?.error || "Failed to submit student registration."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSemesterOptions = () => {
    const count = semesterOptions[form.course];
    if (!count) return null;
    return (
      <select
        name="semester"
        value={form.semester}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="">Select Semester</option>
        {Array.from({ length: count }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
    );
  };

  const today = new Date();
  const maxDobStr = today.toISOString().split("T")[0];
  const minDobStr = "1990-01-01";

  return (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        Student Registration
      </h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded"
          required
        />
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="EN">EN</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="MECHANICAL">MECHANICAL</option>
          <option value="DS">DS</option>
          <option value="CIVIL">CIVIL</option>
          <option value="BIO-TECH">BIO-TECH</option>
          <option value="AI & ML">AI & ML</option>
          <option value="AGRICULTURAL ENGINEERING">
            AGRICULTURAL ENGINEERING
          </option>
        </select>

        <div>
          <p className="font-medium mb-1">Select Course:</p>
          {["B.Tech", "M.Tech", "BCA", "MCA", "PhD"].map((course) => (
            <label key={course} className="mr-4">
              <input
                type="radio"
                name="course"
                value={course}
                checked={form.course === course}
                onChange={handleChange}
                className="mr-1"
              />
              {course}
            </label>
          ))}
        </div>

        {form.course && renderSemesterOptions()}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 rounded"
          min={minDobStr}
          max={maxDobStr}
          required
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded"
        ></textarea>

        {/* 10th Marksheet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload 10th Marksheet (PDF/Jpg/jpeg/png)
          </label>
          <input
            type="file"
            name="tenth"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2 file:mr-4"
            required
          />
        </div>

        {/* 12th Marksheet */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload 12th Marksheet (PDF/Jpg/jpeg/png)
          </label>
          <input
            type="file"
            name="twelfth"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2 file:mr-4"
            required
          />
        </div>
        <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Passport Size Photo (JPG/JPEG, Max 1MB, White Background)
  </label>
  <input
    type="file"
    name="photo"
    accept=".jpg,.jpeg"
    onChange={handleFileChange}
    className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2 file:mr-4"
    required
  />
</div>


        <label className="flex items-center">
          <input
            type="checkbox"
            name="hostelRequested"
            checked={form.hostelRequested}
            onChange={handleChange}
            className="mr-2"
          />
          Request Hostel
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          } text-white py-2 rounded`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {submittedEmail && (
        <div className="mt-6">
          <ApplicationStatus studentEmail={submittedEmail} />
        </div>
      )}
    </div>
  );
};

export default StudentForm;
