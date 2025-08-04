// components/WelcomeBanner.jsx
const WelcomeBanner = () => {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center mt-6">
      <div>
        <p className="text-sm mb-1">{today}</p>
        <h1 className="text-2xl font-bold">Welcome back, John!</h1>
        <p className="text-sm">Always stay updated in your student portal</p>
      </div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4727/4727421.png"
          alt="Student Avatar"
          className="w-32 h-32 mt-4 md:mt-0"
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;
