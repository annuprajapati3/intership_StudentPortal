// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
  FaGraduationCap, FaMoneyBill, FaEdit, FaBook,
  FaTimesCircle, FaChartBar, FaBell, FaCalendarAlt, FaSignOutAlt, FaChalkboardTeacher
} from 'react-icons/fa';

const menuItems = [
  { icon: <FaGraduationCap />, label: 'Dashboard', path: '/' },
  { icon: <FaMoneyBill />, label: 'Attendance', path: '/attendance' },
  { icon: <FaEdit />, label: 'Registration', path: '/registration' },
  { icon: <FaBook />, label: 'Courses', path: '/courses' },
  { icon: <FaTimesCircle />, label: 'Drop Semester', path: '/drop-semester' },
  { icon: <FaChartBar />, label: 'fees', path: '/fees' },
  { icon: <FaBell />, label: 'Notice', path: '/notice' },
  { icon: <FaCalendarAlt />, label: 'Marks', path: '/marks' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-600 to-purple-500 text-white p-6 flex flex-col justify-between rounded-r-xl shadow-lg z-10">
      <div>
        <div className="flex justify-center text-6xl mb-5">
          <FaGraduationCap />
        </div>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white text-purple-600 font-semibold'
                    : 'hover:bg-purple-400 hover:text-white'
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

export default Sidebar;
