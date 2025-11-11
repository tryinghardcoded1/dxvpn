
export enum Protocol {
    VMESS = 'VMESS',
    WIREGUARD = 'WireGuard',
    IPSEC_EAP = 'IPSEC EAP',
    IPSEC_PSK = 'IPSEC PSK',
    OPENVPN_TCP = 'OpenVPN TCP',
    OPENVPN_UDP = 'OpenVPN UDP',
}

export enum ServerStatus {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
}

export interface ServerHistoryPoint {
    time: string;
    value: number;
}

export interface Server {
    id: string;
    name: string;
    protocol: Protocol;
    location: string;
    status: ServerStatus;
    cpuUsage: number;
    ramUsage: number;
    bandwidth: {
        used: number;
        total: number;
    };
    activeUsers: number;
    history: ServerHistoryPoint[];
}
