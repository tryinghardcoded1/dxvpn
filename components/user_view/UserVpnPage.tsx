import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../App';
import { Server, Protocol, ServerStatus } from '../../types';
import { PowerIcon, ShieldCheckIcon, GlobeIcon, ChevronDownIcon } from '../icons';

const serversList: Pick<Server, 'id' | 'name' | 'location' | 'protocol'>[] = [
    { id: '1', name: 'US-West-01', location: 'California, USA', protocol: Protocol.WIREGUARD },
    { id: '2', name: 'EU-Central-03', location: 'Frankfurt, DE', protocol: Protocol.OPENVPN_UDP },
    { id: '3', name: 'Asia-East-05', location: 'Tokyo, JP', protocol: Protocol.VMESS },
    { id: '4', name: 'US-East-02', location: 'New York, USA', protocol: Protocol.IPSEC_EAP },
];

const UserVpnPage: React.FC = () => {
    const { setViewMode } = useContext(AppContext);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedServer, setSelectedServer] = useState(serversList[0]);
    const [connectionTime, setConnectionTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isConnected) {
            timerRef.current = window.setInterval(() => {
                setConnectionTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setConnectionTime(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isConnected]);

    const handleConnectToggle = () => {
        if (isConnected) {
            setIsConnected(false);
        } else {
            setIsConnecting(true);
            setTimeout(() => {
                setIsConnecting(false);
                setIsConnected(true);
            }, 2000);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const getStatusInfo = () => {
        if (isConnected) return { text: 'Connected', color: 'text-green-400' };
        if (isConnecting) return { text: 'Connecting...', color: 'text-yellow-400' };
        return { text: 'Disconnected', color: 'text-red-400' };
    };

    const { text: statusText, color: statusColor } = getStatusInfo();

    return (
        <div className="bg-dx-dark w-full min-h-screen text-dx-text flex flex-col items-center justify-center p-4 relative font-sans">
            <button
                onClick={() => setViewMode('admin')}
                className="absolute top-4 right-4 px-4 py-2 bg-dx-dark-3 text-dx-text font-semibold rounded-lg hover:bg-dx-dark-2 transition-colors border border-dx-dark-3"
            >
                Admin View
            </button>
            <div className="w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-dx-accent">DX</span> VPN
                </h1>
                <p className="text-dx-text mb-8">Your Secure Connection</p>
                
                <div 
                    onClick={handleConnectToggle}
                    className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isConnected ? 'bg-dx-accent/20' : 'bg-dx-dark-2'}`}
                >
                    <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${isConnected ? 'border-dx-accent' : 'border-dx-dark-3'} ${isConnecting ? 'animate-pulse' : ''}`}></div>
                    <div className={`absolute inset-2 rounded-full transition-all duration-300 ${isConnected ? 'bg-dx-accent/10 shadow-glow-accent' : 'bg-dx-dark-2'}`}></div>
                    <PowerIcon className={`w-20 h-20 z-10 transition-colors duration-300 ${isConnected ? 'text-dx-accent' : 'text-dx-text/50'}`} />
                </div>
                
                <div className="mt-8">
                    <div className="flex items-center justify-center space-x-2">
                         <ShieldCheckIcon className={`w-6 h-6 ${statusColor}`} />
                        <span className={`text-xl font-semibold ${statusColor}`}>{statusText}</span>
                    </div>
                    {isConnected && <p className="text-2xl font-mono mt-1 text-white">{formatTime(connectionTime)}</p>}
                </div>
                
                <div className="mt-8 bg-dx-dark-2 p-4 rounded-xl border border-dx-dark-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <GlobeIcon className="w-6 h-6 text-dx-accent" />
                            <div>
                                <p className="text-white font-semibold text-left">{selectedServer.name}</p>
                                <p className="text-xs text-dx-text text-left">{selectedServer.location}</p>
                            </div>
                        </div>
                        <select 
                            value={selectedServer.id} 
                            onChange={(e) => setSelectedServer(serversList.find(s => s.id === e.target.value) || serversList[0])}
                            disabled={isConnected || isConnecting}
                            className="bg-dx-dark-3 border border-dx-dark-3 rounded-lg py-2 pl-3 pr-8 text-white focus:ring-2 focus:ring-dx-accent focus:outline-none appearance-none disabled:opacity-50"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d0d2d6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                            }}
                        >
                            {serversList.map(server => (
                                <option key={server.id} value={server.id}>{server.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                 {isConnected &&
                    <div className="mt-4 text-left text-xs text-dx-text bg-dx-dark-2 p-3 rounded-lg border border-dx-dark-3">
                       <p><strong className="text-white">IP Address:</strong> 172.67.142.114</p>
                       <p><strong className="text-white">Protocol:</strong> {selectedServer.protocol}</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default UserVpnPage;