
import React, { useState, useRef } from 'react';
import PageTitle from '../ui/PageTitle';

const GeneralPage: React.FC = () => {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <PageTitle title="General Settings" subtitle="Configure general application settings." />

            <div className="bg-dx-dark-2 p-6 rounded-xl border border-dx-dark-3">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-dx-dark-3 pb-3">Logo Configuration</h3>
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-dx-dark-3 rounded-full flex items-center justify-center border-2 border-dashed border-dx-text">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-dx-text text-sm">Logo</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/svg+xml"
                        />
                        <button
                            onClick={handleUploadClick}
                            className="px-5 py-2 border border-dx-accent text-dx-accent font-semibold rounded-lg hover:bg-dx-accent hover:text-dx-dark transition-colors"
                        >
                            Upload Logo
                        </button>
                        <p className="text-xs text-dx-text mt-2">Recommended: SVG or PNG, max 200x200px</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 bg-dx-dark-2 p-6 rounded-xl border border-dx-dark-3">
                 <h3 className="text-lg font-semibold text-white mb-4 border-b border-dx-dark-3 pb-3">Other Settings</h3>
                 <p className="text-dx-text">Other general settings would go here.</p>
            </div>
        </div>
    );
};

export default GeneralPage;
