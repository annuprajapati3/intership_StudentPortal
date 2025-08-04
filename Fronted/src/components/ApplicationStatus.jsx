import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ApplicationStatus = ({ studentEmail }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students`);
        const student = res.data.find((s) => s.email === studentEmail);
        if (student) {
          setStatus(student.status);
        } else {
          setStatus('not_found');
        }
      } catch (err) {
        console.error('Error fetching student status:', err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [studentEmail]);

  if (loading) return <p className="text-gray-500">Checking your application status...</p>;

  if (status === 'approved') {
    return (
      <p className="text-green-600 font-semibold flex items-center gap-2">
        <FaCheckCircle /> Your application has been approved!
      </p>
    );
  }

  if (status === 'rejected') {
    return (
      <p className="text-red-600 font-semibold flex items-center gap-2">
        <FaTimesCircle /> Your application was rejected.
      </p>
    );
  }

  if (status === 'pending') {
    return <p className="text-yellow-600 font-medium">Your application is still under review.</p>;
  }

  return <p className="text-gray-400 italic">No application record found.</p>;
};

export default ApplicationStatus;
