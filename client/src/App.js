import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import CandidateList from "./pages/CandidateList";
import ElectionResult from "./pages/ElectionResult";
import DownloadEpic from "./pages/DownloadEpic";
import SearchVoter from "./pages/SearchVoter";
import Complaint from "./pages/Complaint";
import CurrentElection from "./pages/CurrentElection";
import PastElection from "./pages/PastElection";
import ElectionStatistics from "./pages/ElectionStatistics";

function Layout() {
    const location = useLocation();

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vote" element={<CandidateList />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/result" element={<ElectionResult />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/current-election" element={<CurrentElection />} />
                <Route path="/past-election" element={<PastElection />} />
                <Route path="/statistics" element={<ElectionStatistics />} />
                <Route path="/download" element={<DownloadEpic />} />
                <Route path="/search" element={<SearchVoter />} />
                <Route path="/complaint" element={<Complaint />} />
                {/* Catch all undefined routes and redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
