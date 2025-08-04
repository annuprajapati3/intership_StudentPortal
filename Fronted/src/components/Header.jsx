// components/Header.jsx
import dummy from '../assets/dummy.jpg';
const Header = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md rounded-lg">
      <input type="text" placeholder="Search..." className="px-4 py-2 w-1/3 rounded-lg border border-gray-300" />
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-semibold">John Doe</p>
          <p className="text-xs text-gray-500">3rd year</p>
        </div>
        <img src={`${dummy}`} className="rounded-full w-10 h-10" alt="profile" />
      </div>
    </div>
  );
};

export default Header;
