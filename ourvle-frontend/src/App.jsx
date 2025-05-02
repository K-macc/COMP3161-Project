import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseRegistration from './pages/CourseRegistration';
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails';
import CourseMembers from './pages/CourseMembers';
import MyCourses from './pages/MyCourses';
import CoursesList from './pages/CoursesList';
import Navbar from './components/Navbar';
import StudentCourses from './pages/StudentCourses';
import LecturerCourses from './pages/LecturerCourses';
import CreateForumPage from './pages/CreateForumPage';
import CourseForums from './pages/CourseForums';
import CreateThread from './pages/CreateThread';
import ForumThreads from './pages/ForumThreads';
import AddReply from './pages/AddReply';
import CreateEvent from './pages/CreateEvent';
import UpdateSection from './pages/UpdateSection';
import CreateSection from './pages/CreateSection';
import CreateAssignment from './pages/CreateAssignment';
import SubmitAssignment from './pages/SubmitAssignment';
import GradeAssignment from './pages/GradeAssignment';
import FinalAverage from './pages/FinalAverage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-course" element={<CourseRegistration />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/course-members/:courseId" element={<CourseMembers />} />
        <Route path="/courses-list" element={<CoursesList />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/lecturer-courses" element={<LecturerCourses />} />
        <Route path="/create-forum/:courseId" element={<CreateForumPage />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
