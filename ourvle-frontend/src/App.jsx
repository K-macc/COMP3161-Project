import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Dashboard from "./pages/Dashboard";
import CourseRegistration from "./pages/course/CourseRegistration";
import CreateCourse from "./pages/course/CreateCourse";
import CourseDetails from "./pages/course/CourseDetails";
import CourseMembers from "./pages/course/CourseMembers";
import MyCourses from "./pages/course/MyCourses";
import CoursesList from "./pages/course/CoursesList";
import Navbar from "./components/Navbar";
import StudentCourses from "./pages/course/StudentCourses";
import LecturerCourses from "./pages/course/LecturerCourses";
import CreateForumPage from "./pages/forum/CreateForumPage";
import CourseForums from "./pages/forum/CourseForums";
import CreateThread from "./pages/forum/thread/CreateThread";
import ForumThreads from "./pages/forum/thread/ForumThreads";
import Replies from "./pages/forum/thread/reply/Replies";
import CreateEvent from "./pages/calendar_event/CreateEvent";
import CourseEvents from "./pages/calendar_event/CourseEvents";
import StudentEvents from "./pages/calendar_event/StudentEvents";
import CreateSection from "./pages/course/section/CreateSection";
import CreateAssignment from "./pages/assignment/CreateAssignment";
import CourseAssignments from "./pages/assignment/CourseAssignments";
import AssignmentSubmissions from "./pages/assignment/AssignmentSubmissions";
import SubmitAssignment from "./pages/assignment/SubmitAssignment";
import GradeAssignment from "./pages/assignment/GradeAssignment";
import FinalAverage from "./pages/assignment/FinalAverage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
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
        <Route path="/threads/:threadId/replies" element={<Replies />} />
        <Route path="/create-section/:courseId" element={<CreateSection />} />
        <Route path="/forums/:forumId/threads/create-thread" element={<CreateThread />} />
        <Route path="/create-event/:courseId" element={<CreateEvent />} />
        <Route path="/get-events/:courseId" element={<CourseEvents />} />
        <Route path="/my-events" element={<StudentEvents />} />
        <Route path="/create-assignment/:courseId" element={<CreateAssignment />} />
        <Route path="/get-assignments/:courseId" element={<CourseAssignments />} />
        <Route path="/assignment-submissions/:assignmentId" element={<AssignmentSubmissions />} />
        <Route path="/submit-assignment/:assignmentId" element={<SubmitAssignment />} />
        <Route path="/grade-assignment/:assignmentId/:studentId" element={<GradeAssignment />} />
        <Route path="/final-average/:studentId" element={<FinalAverage />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
