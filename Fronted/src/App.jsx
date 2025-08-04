// App.jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import Finance from './components/Finance';
import Courses from './components/Courses';
import Notices from './components/Notices';
import AllCourses from './components/AllCourses';
import StudentForm from './components/StudentForm';
import TeacherPanel from './components/TeacherPanel';
import AttendancePage from './components/Attendance';
import TeacherLayout from './components/Teacherlayout';
import TeacherDashboard from './components/TeacherDashboard';
import AttendanceTable from './components/AttendanceTable';
import StudentAttendance from './components/StudentAttendance';
import Fees from './components/Fees';
import FeesTeacher from './components/FeesTeacher';
import StudentInfo from './components/StudentInfo';
import Marks from './components/Marks';
import AdditionalCharges from './components/FineManagement';
import FineManagement from './components/FineManagement';
import CourseSelector from './components/CourseSelector';
import TeacherCourses from './components/TeacherCourses';

function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Finance />
        <Notices />
      </div>
      <Courses />
    </>
  );
}

function App() {
  return (
    <div className="bg-purple-100 min-h-screen">
      <Sidebar />
      <main className="ml-64 p-6">
        <Header />
        <Routes>
          {/* Public/Admin/Student Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/registration" element={<StudentForm />} />
          <Route path="/attendance" element={<StudentAttendance/>} />
          <Route path="/fees" element={<Fees></Fees>} />
          <Route path="/marks" element={<Marks></Marks>} />
          <Route path="/courses" element={<CourseSelector></CourseSelector>} />
          {/* Teacher Routes with Layout */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} /> {/* /teacher */}
            <Route path="students" element={<TeacherPanel />} /> {/* /teacher/students */}
            <Route path="attendance" element={<AttendancePage />} /> {/* /teacher/attendance */}
            <Route path="table" element={<AttendanceTable />} /> 
            <Route path='fees' element={<FeesTeacher></FeesTeacher>}></Route>
            <Route path='student_info' element={<StudentInfo></StudentInfo>}></Route>
            <Route path='charges' element={<FineManagement></FineManagement>}></Route>
            <Route path="courses" element={<TeacherCourses></TeacherCourses>} />
            {/* Add more like marks, schedule, etc., as needed */}
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="bg-white p-8 mt-6 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Page Not Found</h1>
                <p className="text-gray-600">Invalid route. Please check the URL.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
