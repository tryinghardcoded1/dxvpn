
import React from 'react';
import PageTitle from '../ui/PageTitle';
import { ServerIcon, UserIcon, DollarSignIcon } from '../icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-dx-dark-2 p-6 rounded-xl border border-dx-dark-3 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-dx-text uppercase tracking-wider text-sm">{title}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="p-3 bg-dx-dark-3 rounded-lg text-dx-accent">
                <Icon className="w-7 h-7" />
            </div>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    return (
        <div>
            <PageTitle title="Dashboard" subtitle="Overview of your VPN service." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Servers" value="24" icon={ServerIcon} />
                <StatCard title="Active Users" value="1,482" icon={UserIcon} />
                <StatCard title="Monthly Revenue" value="$5,620" icon={DollarSignIcon} />
            </div>
            <div className="mt-8 bg-dx-dark-2 p-6 rounded-xl border border-dx-dark-3">
                <h2 className="text-xl font-semibold text-white mb-4">Live Traffic</h2>
                <div className="h-64 flex items-center justify-center text-dx-text">
                    {/* Placeholder for a chart */}
                    Chart component would be here.
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
