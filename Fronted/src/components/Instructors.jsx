// components/Instructors.jsx
const Instructors = () => {
  const imgs = [
    "https://i.pravatar.cc/40?img=10",
    "https://i.pravatar.cc/40?img=20",
    "https://i.pravatar.cc/40?img=30",
  ];

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Course Instructors</h3>
      <div className="flex gap-2">
        {imgs.map((img, i) => (
          <img key={i} src={img} className="rounded-full w-10 h-10 border-2 border-purple-400" alt="instructor" />
        ))}
      </div>
    </div>
  );
};

export default Instructors;
