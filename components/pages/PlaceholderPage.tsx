
import React from 'react';
import PageTitle from '../ui/PageTitle';

const PlaceholderPage: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
    return (
        <div>
            <PageTitle title={title} subtitle={subtitle} />
            <div className="bg-dx-dark-2 p-8 rounded-xl border border-dx-dark-3 text-center">
                <h2 className="text-2xl font-semibold text-white">Coming Soon</h2>
                <p className="text-dx-text mt-2">This page is under construction. Check back later for updates!</p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
