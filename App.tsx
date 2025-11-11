import React, { useState, useEffect, createContext } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/pages/DashboardPage';
import ServerPage from './components/pages/ServerPage';
import WebsiteManagePage from './components/pages/WebsiteManagePage';
import BannerPage from './components/pages/BannerPage';
import UserPage from './components/pages/UserPage';
import FaqPage from './components/pages/FaqPage';
import FeedbackPage from './components/pages/FeedbackPage';
import GeneralPage from './components/pages/GeneralPage';
import AppManagePage from './components/pages/AppManagePage';
import SubscriptionPage from './components/pages/SubscriptionPage';
import UserVpnPage from './components/user_view/UserVpnPage';

export const AppContext = createContext<{
    theme: string;
    toggleTheme: () => void;
    viewMode: 'admin' | 'user';
    setViewMode: (mode: 'admin' | 'user') => void;
}>({
    theme: 'dark',
    toggleTheme: () => {},
    viewMode: 'admin',
    setViewMode: () => {},
});

const App: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const AdminView = () => (
        <HashRouter>
            <div className="flex h-screen bg-gray-100 dark:bg-dx-dark text-dx-text overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col transition-all duration-300">
                    <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                    <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/website-manage" element={<WebsiteManagePage />} />
                            <Route path="/banner" element={<BannerPage />} />
                            <Route path="/user" element={<UserPage />} />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route path="/feedback" element={<FeedbackPage />} />
                            <Route path="/general" element={<GeneralPage />} />
                            <Route path="/app-manage" element={<AppManagePage />} />
                            <Route path="/subscription" element={<SubscriptionPage />} />
                            <Route path="/server" element={<ServerPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </HashRouter>
    );

    const UserView = () => (
        <UserVpnPage />
    );

    return (
        <AppContext.Provider value={{ theme, toggleTheme, viewMode, setViewMode }}>
             {viewMode === 'admin' ? <AdminView /> : <UserView />}
        </AppContext.Provider>
    );
};

export default App;