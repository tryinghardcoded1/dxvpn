
import React from 'react';

interface PageTitleProps {
    title: string;
    subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white relative inline-block">
                {title}
                <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-dx-accent shadow-glow-accent"></span>
            </h1>
            {subtitle && <p className="mt-2 text-dx-text">{subtitle}</p>}
        </div>
    );
};

export default PageTitle;
