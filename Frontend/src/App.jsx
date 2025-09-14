// src/App.jsx
import { Routes, Route } from "react-router-dom"; 
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";

import Books from "./pages/Books";
import BookEdit from "./pages/BookEdit.jsx";

import Contact from "./pages/Contact";
import AddPublication from "./pages/AddPublication.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";


import Thesis from "./pages/Thesis.jsx";
import ThesisDetail from "./pages/ThesisDetail.jsx";
import ThesisEdit from "./pages/ThesisEdit.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        
        <Route path="/resources/thesis" element={<Thesis />} />
        <Route path="/thesis/:id" element={<ThesisDetail />} />

        
        <Route path="/profile" element={<ProfilePage />} />

        {/* Other resources */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/resources/books" element={<Books />} />

       
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/books/:id/edit" element={<BookEdit />} />
        <Route path="/thesis/:id/edit" element={<ThesisEdit />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-publication" element={<AddPublication />} />
       
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
