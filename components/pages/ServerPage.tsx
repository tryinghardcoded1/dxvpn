
import React, { useState, useEffect } from 'react';
import { Server, Protocol, ServerStatus, ServerHistoryPoint } from '../../types';
import PageTitle from '../ui/PageTitle';
import { EditIcon, TrashIcon, XIcon, ChevronDownIcon, UserIcon } from '../icons';

const baseServers: Omit<Server, 'cpuUsage' | 'ramUsage' | 'bandwidth' | 'activeUsers' | 'history'>[] = [
    { id: '1', name: 'US-West-01', protocol: Protocol.WIREGUARD, location: 'California, USA', status: ServerStatus.ONLINE },
    { id: '2', name: 'EU-Central-03', protocol: Protocol.OPENVPN_UDP, location: 'Frankfurt, DE', status: ServerStatus.ONLINE },
    { id: '3', name: 'Asia-East-05', protocol: Protocol.VMESS, location: 'Tokyo, JP', status: ServerStatus.OFFLINE },
    { id: '4', name: 'US-East-02', protocol: Protocol.IPSEC_EAP, location: 'New York, USA', status: ServerStatus.ONLINE },
];

const generateAnalytics = (): Pick<Server, 'cpuUsage' | 'ramUsage' | 'bandwidth' | 'activeUsers' | 'history'> => {
    const history = Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: Math.random() * 60 + 20,
    }));
    return {
        cpuUsage: history[history.length - 1].value,
        ramUsage: Math.random() * 70 + 15,
        bandwidth: { used: Math.floor(Math.random() * 800) + 100, total: 2048 },
        activeUsers: Math.floor(Math.random() * 200),
        history,
    };
};

const MiniChart: React.FC<{data: ServerHistoryPoint[], color: string, height?: number, width?: number}> = ({ data, color, height = 80, width = 300 }) => {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(p => p.value), 0);
    const normalizedMax = maxVal > 0 ? maxVal * 1.2 : 100; // Give some headroom

    const path = data.map((point, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (point.value / normalizedMax) * height;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

    const uniqueId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
            <defs>
                <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${uniqueId})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

const MetricDisplay: React.FC<{label: string, value: string, children?: React.ReactNode}> = ({ label, value, children }) => (
    <div className="bg-dx-dark-3/50 p-3 rounded-lg flex flex-col justify-between">
        <div>
            <span className="text-xs text-dx-text uppercase tracking-wider">{label}</span>
            <p className="text-white font-bold text-xl">{value}</p>
        </div>
        {children}
    </div>
);

const AnalyticsView: React.FC<{ server: Server }> = ({ server }) => (
    <div className="bg-dx-dark-3 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
            <MetricDisplay label="CPU Usage" value={`${server.cpuUsage.toFixed(1)}%`}>
                <div className="w-full bg-dx-dark-2 rounded-full h-1.5 mt-2">
                    <div className="bg-dx-accent h-1.5 rounded-full" style={{ width: `${server.cpuUsage}%` }}></div>
                </div>
            </MetricDisplay>
             <MetricDisplay label="RAM Usage" value={`${server.ramUsage.toFixed(1)}%`}>
                <div className="w-full bg-dx-dark-2 rounded-full h-1.5 mt-2">
                    <div className="bg-dx-accent-2 h-1.5 rounded-full" style={{ width: `${server.ramUsage}%` }}></div>
                </div>
            </MetricDisplay>
            <MetricDisplay label="Bandwidth" value={`${server.bandwidth.used} / ${server.bandwidth.total} GB`} />
            <MetricDisplay label="Active Users" value={`${server.activeUsers}`}>
                <UserIcon className="w-4 h-4 text-dx-text mt-2"/>
            </MetricDisplay>
        </div>
        <div className="md:col-span-1 lg:col-span-2 bg-dx-dark-2/50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">CPU History (Live)</h4>
            <MiniChart data={server.history} color="#00f6ff" />
        </div>
    </div>
);

const ServerPage: React.FC = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<Server | null>(null);
    const [expandedServerId, setExpandedServerId] = useState<string | null>(null);

    useEffect(() => {
        setServers(baseServers.map(s => ({ ...s, ...generateAnalytics() })));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setServers(currentServers =>
                currentServers.map(server => {
                    const change = (Math.random() - 0.5) * 5;
                    const newCpuUsage = Math.max(0, Math.min(100, server.cpuUsage + change));
                    const newHistory = [...server.history.slice(1), { time: 'now', value: newCpuUsage }];
                    return {
                        ...server,
                        cpuUsage: newCpuUsage,
                        ramUsage: Math.max(0, Math.min(100, server.ramUsage + (Math.random() - 0.5) * 3)),
                        activeUsers: Math.max(0, server.activeUsers + Math.floor((Math.random() - 0.48) * 5)),
                        status: server.status === ServerStatus.OFFLINE ? ServerStatus.OFFLINE : (newCpuUsage > 95 ? ServerStatus.OFFLINE : ServerStatus.ONLINE),
                        history: newHistory,
                    };
                })
            );
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedServerId(currentId => (currentId === id ? null : id));
    };

    const openModal = (server: Server | null = null) => {
        setEditingServer(server);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSave = (serverData: Omit<Server, 'id' | 'cpuUsage' | 'ramUsage' | 'bandwidth' | 'activeUsers' | 'history'>) => {
        if (editingServer) {
            setServers(servers.map(s => s.id === editingServer.id ? { ...editingServer, ...serverData } : s));
        } else {
            const newServer: Server = { ...serverData, id: new Date().getTime().toString(), ...generateAnalytics() };
            setServers([...servers, newServer]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this server?')) {
            setServers(servers.filter(s => s.id !== id));
        }
    };

    return (
        <div>
            <PageTitle title="Server Management" subtitle="Monitor real-time status and manage VPN servers." />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => openModal()}
                    className="px-6 py-2 bg-dx-accent text-dx-dark font-bold rounded-lg shadow-glow-accent hover:bg-opacity-90 transition-all duration-300"
                >
                    Add Server
                </button>
            </div>

            <div className="bg-dx-dark-2 rounded-xl border border-dx-dark-3 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dx-dark-3 uppercase text-sm text-dx-text">
                            <tr>
                                <th className="p-4 w-12"></th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Protocol</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servers.map(server => (
                                <React.Fragment key={server.id}>
                                    <tr className="hover:bg-dx-dark-3 transition-colors border-b border-dx-dark-3">
                                        <td className="p-4">
                                            <button onClick={() => toggleExpand(server.id)} className="p-1 text-dx-text hover:text-dx-accent">
                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedServerId === server.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="p-4 font-medium text-white">{server.name}</td>
                                        <td className="p-4">{server.protocol}</td>
                                        <td className="p-4">{server.location}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${server.status === ServerStatus.ONLINE ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {server.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex space-x-2">
                                            <button onClick={() => openModal(server)} className="p-2 text-dx-text hover:text-dx-accent transition-colors"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(server.id)} className="p-2 text-dx-text hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} className="p-0 border-none">
                                            <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: expandedServerId === server.id ? '500px' : '0' }}>
                                                <AnalyticsView server={server} />
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && <ServerModal server={editingServer} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

interface ServerModalProps {
    server: Server | null;
    onSave: (serverData: Omit<Server, 'id' | 'cpuUsage' | 'ramUsage' | 'bandwidth' | 'activeUsers' | 'history'>) => void;
    onClose: () => void;
}

const ServerModal: React.FC<ServerModalProps> = ({ server, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: server?.name || '',
        protocol: server?.protocol || Protocol.WIREGUARD,
        location: server?.location || '',
        status: server?.status || ServerStatus.ONLINE,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-dx-dark-2 rounded-xl border border-dx-dark-3 w-full max-w-lg animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b border-dx-dark-3">
                    <h2 className="text-xl font-bold text-white">{server ? 'Edit Server' : 'Add New Server'}</h2>
                    <button onClick={onClose} className="text-dx-text hover:text-white"><XIcon className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dx-text mb-1">Server Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dx-dark-3 border border-dx-dark-3 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-dx-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dx-text mb-1">Protocol</label>
                            <select name="protocol" value={formData.protocol} onChange={handleChange} className="w-full bg-dx-dark-3 border border-dx-dark-3 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-dx-accent focus:outline-none">
                                {Object.values(Protocol).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dx-text mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-dx-dark-3 border border-dx-dark-3 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-dx-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dx-text mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-dx-dark-3 border border-dx-dark-3 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-dx-accent focus:outline-none">
                                {Object.values(ServerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-dx-dark-3 rounded-b-xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-dx-accent hover:bg-opacity-90 text-dx-dark font-bold rounded-lg transition-colors">Save Server</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ServerPage;
