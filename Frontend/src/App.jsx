// src/App.jsx
import { Routes, Route } from "react-router-dom"; // remove BrowserRouter
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
//import Auth from "./pages/Auth";
//import Profile from "./pages/Profile";
//import AboutKFR from "./pages/AboutKFR";
//import Rules from "./pages/Rules";
import BookDetails from "./pages/BookDetails";
//import Announcements from "./pages/Announcements";
//import Resources from "./pages/Resources";
import Books from "./pages/Books";
//import Thesis from "./pages/Thesis";
import Contact from "./pages/Contact";
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

        {/* If you want to protect profile later, wrap with ProtectedRoute */}
        {/* 
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["student","teacher","librarian"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Other resources */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/resources/books" element={<Books />} />

        {/* ✅ Keep dev’s code in the conflict: use /books/:id (not /book/:id) */}
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/contact" element={<Contact />} />
        {/*
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
        
        */}
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <Footer />
    </>
  );
}
