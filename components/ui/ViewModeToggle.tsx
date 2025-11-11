import React, { useContext } from 'react';
import { AppContext } from '../../App';

const ViewModeToggle: React.FC = () => {
    const { viewMode, setViewMode } = useContext(AppContext);

    const baseClass = 'px-4 py-1.5 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-dx-accent';
    const activeClass = 'bg-dx-accent text-dx-dark shadow-glow-accent';
    const inactiveClass = 'bg-dx-dark-3 text-dx-text hover:bg-opacity-75';

    return (
        <div className="flex items-center p-1 bg-dx-dark-2 rounded-lg border border-dx-dark-3">
            <button
                onClick={() => setViewMode('admin')}
                className={`${baseClass} ${viewMode === 'admin' ? activeClass : inactiveClass}`}
                aria-pressed={viewMode === 'admin'}
            >
                Admin
            </button>
            <button
                onClick={() => setViewMode('user')}
                className={`${baseClass} ${viewMode === 'user' ? activeClass : inactiveClass}`}
                aria-pressed={viewMode === 'user'}
            >
                User
            </button>
        </div>
    );
};

export default ViewModeToggle;
