import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import CreateCourse from './components/pages/CreateCourse';
import CourseMembers from './components/pages/CourseMembers';
import RegisterCourse from './components/pages/RegisterCourse';
import AllCourses from './components/pages/AllCourses';
import StudentCourses from './components/pages/StudentCourses';
import LecturerCourses from './components/pages/LecturerCourses';
import SpecificCourses from './components/pages/SpecificCourses';

function App(){
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/course-members" element={<CourseMembers />} />
        <Route path="/register-course" element={<RegisterCourse />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/lecturer-courses" element={<LecturerCourses />} />
        <Route path="/specific-courses" element={<SpecificCourses />} />
      </Routes>
    </Router>
  );
}

export default App;