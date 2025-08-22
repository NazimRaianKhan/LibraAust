import { Routes, Route } from "react-router-dom"; // remove BrowserRouter
import Navbar from "./components/Navbar";
//import Footer from "./components/Footer";
//import Home from "./pages/Home";
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

export default function App() {
  return (
    <>
      <Navbar />
      
    </>
  );
}
