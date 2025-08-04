// components/AllCourses.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        console.log("API response:", res.data);
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center">Loading courses...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">All Available Courses</h2>
      <div className="space-y-4">
        {Array.isArray(courses) && courses.map((course) => (
          <div
            key={course._id}
            className="p-4 border border-purple-200 rounded-lg hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-purple-700">{course.title} ({course.code})</h3>
            <p className="text-gray-600 mt-1">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Instructor:</strong> {course.instructor} | <strong>Credits:</strong> {course.credits} | <strong>Semester:</strong> {course.semester}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
