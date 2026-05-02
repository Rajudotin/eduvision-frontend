import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportsPage from "./pages/ReportsPage";
import AttendancePage from "./pages/AttendancePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ClassesPage from "./pages/ClassesPage";
import TeacherAttendancePage from "./pages/TeacherAttendancePage";
import TeacherClasses from "./pages/TeacherClasses";
import TeacherReports from "./pages/TeacherReports";

// Wrapper to conditionally show Navbar & Footer
function AppLayout() {
  const location = useLocation();

  // Pages that have their OWN sidebar (no global navbar/footer needed)
  const dashboardPages = [
    "/student/dashboard",
    "/student/attendance",
    "/student/reports",
    "/student/profile",
    "/student/classes",
    "/teacher/dashboard",
    "/teacher/attendance",
    "/teacher/classes",
    "/teacher/reports",
    "/teacher/profile",
    "/admin/dashboard",
    "/admin/reports",
    "/admin/profile",
    "/login",
    "/register",
  ];

  const hideNavFooter = dashboardPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<AttendancePage />} />
        <Route path="/student/reports" element={<ReportsPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
        <Route path="/teacher/reports" element={<TeacherReports />} />
        <Route path="/teacher/profile" element={<ProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/classes" element={<ClassesPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
