// layouts/TeacherLayout.jsx
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';

const TeacherLayout = () => {
  return (
    <div className="flex">
      <TeacherSidebar />
      <main className="flex-1 p-6 bg-purple-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
