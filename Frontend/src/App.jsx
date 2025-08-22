// src/App.jsx
import { Routes, Route } from "react-router-dom"; // remove BrowserRouter
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
//import Auth from "./pages/Auth";
//import Profile from "./pages/Profile";
//import AboutKFR from "./pages/AboutKFR";
//import Rules from "./pages/Rules";
//import BookDetails from "./pages/BookDetails";
//import Announcements from "./pages/Announcements";
//import Resources from "./pages/Resources";
//import Books from "./pages/Books";
//import Thesis from "./pages/Thesis";
//import Contact from "./pages/Contact";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ✅ Added imports */
import Thesis from "./pages/Thesis.jsx";
import ThesisDetail from "./pages/ThesisDetail.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
export default function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />

        {/* ✅ Added routes for your three pages */}
        <Route path="/resources/thesis" element={<Thesis />} />
        <Route path="/thesis/:id" element={<ThesisDetail />} />
        {/*<Route
          path="/profile"
          element={
            <ProtectedRoute roles={["student","teacher","librarian"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />*/}
        <Route path="/profile" element={<ProfilePage />} />

        {/*
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/books" element={<Books />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/about/kfr" element={<AboutKFR />} />
        <Route path="/about/rules" element={<Rules />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/manage/announcements"
          element={
            <ProtectedRoute roles={["librarian"]}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />
        */}
      </Routes>
      
      <Footer />
    </>
  );
}
