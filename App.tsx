import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { JoinTeam } from './pages/JoinTeam';
import { CreateTeam } from './pages/CreateTeam';
import { Draft } from './pages/Draft';
import { ProjectIdea } from './pages/ProjectIdea';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Announcements } from './pages/Announcements';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
    return (
        <ToastProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Authenticated Routes */}
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/join-team" element={<JoinTeam />} />
                        <Route path="/create-team" element={<CreateTeam />} />
                        <Route path="/draft" element={<Draft />} />
                        <Route path="/project-idea" element={<ProjectIdea />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/announcements" element={<Announcements />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ToastProvider>
    );
};

export default App;