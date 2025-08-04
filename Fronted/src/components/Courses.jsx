// components/Courses.jsx
import { FaLaptopCode } from 'react-icons/fa';
import { MdStorage } from 'react-icons/md';

const Courses = () => {
  const courses = [
    {
      name: "Object Oriented Programming",
      icon: <FaLaptopCode className="text-3xl text-purple-600" />,
    },
    {
      name: "Fundamentals of Database Systems",
      icon: <MdStorage className="text-3xl text-purple-600" />,
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Enrolled Courses</h2>
        <button className="text-purple-600 text-sm hover:underline">See all</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, i) => (
          <div
            key={i}
            className="bg-purple-100 p-4 rounded-xl flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">{course.icon}</div>
              <span className="text-purple-800 font-medium">{course.name}</span>
            </div>
            <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
