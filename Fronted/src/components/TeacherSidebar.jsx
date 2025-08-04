
import { Link, useLocation } from 'react-router-dom';
import {
  FaUserGraduate,
  FaClipboardList,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const menuItems = [
  { icon: <FaClipboardList />, label: 'Attendance', path: '/teacher/attendance' },
  { icon: <FaBook />, label: 'Additional Charges', path: '/teacher/charges' },
  { icon: <FaUserGraduate />, label: 'Students', path: '/teacher/students' },
  { icon: <FaChalkboardTeacher />, label: 'Attendance Table', path: '/teacher/table' },
  { icon: <FaCalendarAlt />, label: 'Fees', path: '/teacher/fees' },
  { icon: <FaBook />, label: 'Student Info', path: '/teacher/student_info' },
    { icon: <FaUserGraduate />, label: 'Courses', path: '/teacher/courses' },
];

const TeacherSidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-700 to-purple-600 text-white p-6 flex flex-col justify-between rounded-r-xl shadow-lg z-10">
      <div>
        <div className="flex justify-center text-4xl mb-6">
          <FaChalkboardTeacher />
        </div>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white text-purple-700 font-semibold'
                    : 'hover:bg-purple-500 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button className="flex items-center gap-2 mt-6 hover:text-red-300 transition duration-200">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default TeacherSidebar;
