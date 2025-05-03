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
import Replies from './pages/Replies';
import CreateEvent from './pages/CreateEvent';
import CourseEvents from './pages/CourseEvents';
import StudentEvents from './pages/StudentEvents';
import CourseSection from './pages/CourseSection';
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
        <Route path="/get-forums/:courseId" element={<CourseForums />} />
        <Route path="/forums/:forumId/threads" element={<ForumThreads />} />
        <Route path="/threads/:threadId/replies" element={<Replies />} />"
        {/* <Route path="/forums/:forumId/threads/create-thread" element={<CreateThread />} />
        <Route path="/forums/:forumId/threads/:threadId/replies" element={<AddReply />} />
        <Route path="/create-event/:courseId" element={<CreateEvent />} />
        <Route path="/update-section/:courseId" element={<UpdateSection />} />
        <Route path="/create-section/:courseId" element={<CreateSection />} />
        <Route path="/create-assignment/:courseId" element={<CreateAssignment />} />
        <Route path="/submit-assignment/:courseId" element={<SubmitAssignment />} />
        <Route path="/grade-assignment/:courseId" element={<GradeAssignment />} />
        <Route path="/final-average/:courseId" element={<FinalAverage />} /> */}
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
