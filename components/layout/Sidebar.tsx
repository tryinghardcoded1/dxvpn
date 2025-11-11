
import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Removed AppManagePage and SubscriptionPage from this import as they are page components, not icons.
import { DashboardIcon, WebIcon, ImageIcon, UserIcon, HelpIcon, MessageIcon, SettingsIcon, ServerIcon, SmartphoneIcon, DollarSignIcon, ChevronLeftIcon } from '../icons';

const navItems = [
    { to: '/', label: 'Dashboard', icon: DashboardIcon },
    { to: '/website-manage', label: 'Website Manage', icon: WebIcon },
    { to: '/banner', label: 'Banner', icon: ImageIcon },
    { to: '/user', label: 'User', icon: UserIcon },
    { to: '/faq', label: 'FAQ', icon: HelpIcon },
    { to: '/feedback', label: 'Feedback', icon: MessageIcon },
    { to: '/general', label: 'General', icon: SettingsIcon },
    { to: '/app-manage', label: 'App Manage', icon: SmartphoneIcon },
    { to: '/subscription', label: 'Subscription', icon: DollarSignIcon },
    { to: '/server', label: 'Server', icon: ServerIcon },
];

interface SidebarProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setOpen }) => {
    const baseLinkClass = "flex items-center p-3 my-1 rounded-lg text-dx-text hover:bg-dx-dark-3 transition-all duration-200 group";
    const activeLinkClass = "bg-dx-dark-3 text-dx-accent shadow-glow-accent";

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setOpen(false)}></div>
            <aside className={`bg-dx-dark-2 flex flex-col z-40 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0 md:w-20'} overflow-hidden`}>
                <div className="flex items-center justify-between p-4 border-b border-dx-dark-3 h-[65px]">
                    <h1 className={`text-2xl font-bold text-white whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100 md:w-0'}`}>
                       <span className={`text-dx-accent ${!isOpen && 'md:hidden'}`}>DX</span>
                       <span className={`${!isOpen && 'md:hidden'}`}> VPN</span>
                    </h1>
                     <button onClick={() => setOpen(!isOpen)} className={`text-dx-text hover:text-dx-accent p-2 rounded-full absolute top-4 bg-dx-dark-3 right-[-15px] border-2 border-dx-dark-2 z-50 ${!isOpen && 'md:rotate-180'} transition-transform duration-300`}>
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-4 overflow-y-auto">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
                                >
                                    <item.icon className="h-6 w-6 text-dx-accent group-hover:scale-110 transition-transform"/>
                                    <span className={`ml-4 transition-opacity duration-200 ${!isOpen && 'md:hidden'}`}>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;