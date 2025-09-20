//src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./state/AuthContext";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutKFR from "./pages/About";
import RulesAndRegulations from "./pages/RulesAndRegulations";
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
import MyBorrows from "./pages/MyBorrows.jsx";
import ManageBorrows from "./pages/ManageBorrows.jsx";
import { Import } from "lucide-react";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Public routes */}
        <Route path="/resources/books" element={<Books />} />
        <Route path="/resources/thesis" element={<Thesis />} />
        <Route path="/about/kfr" element={<AboutKFR />} />
        <Route path="/about/rules" element={<RulesAndRegulations/>}></Route>
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/thesis/:id" element={<ThesisDetail />} />
        <Route path="/contact" element={<Contact />} />


        {/* Protected routes - require authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-publication"
          element={
            <ProtectedRoute>
              <AddPublication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id/edit"
          element={
            <ProtectedRoute>
              <BookEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thesis/:id/edit"
          element={
            <ProtectedRoute>
              <ThesisEdit />
            </ProtectedRoute>
          }
        />
        <Route path="/my-borrows" element={<MyBorrows />} />
        <Route path="/manage-borrows" element={<ManageBorrows />} />

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
    </AuthProvider>
  );
}
