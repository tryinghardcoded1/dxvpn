import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { MenuIcon, MoonIcon, SunIcon } from '../icons';
import ViewModeToggle from '../ui/ViewModeToggle';

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
    const { theme, toggleTheme } = useContext(AppContext);

    return (
        <header className="bg-gray-50 dark:bg-dx-dark-2 shadow-md dark:shadow-none dark:border-b dark:border-dx-dark-3 p-4 flex justify-between items-center z-10">
            <button
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-dx-text hover:text-dx-accent dark:hover:text-dx-accent transition-colors"
                aria-label="Toggle sidebar"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
                <ViewModeToggle />
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dx-dark-3 text-dx-text"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-dx-accent-2" />}
                </button>
                <div className="w-9 h-9 bg-dx-accent-2 rounded-full flex items-center justify-center text-white font-bold shadow-glow-accent-2">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;