// components/Notices.jsx
import { useState } from 'react';

const Notices = () => {
  const [expanded, setExpanded] = useState(false);

  const shortText = "Today’s DBMS class is shifted to 12 PM. Please check your course schedule.";
  const fullText = shortText + " This change has been made to accommodate the guest lecture at 10 AM. Attendance is compulsory for all students.";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-lg font-semibold mb-4">Daily Notice</h2>
      <p className="text-sm text-gray-700">
        {expanded ? fullText : shortText}
      </p>
      <button
        className="mt-2 text-purple-600 text-sm hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
};

export default Notices;