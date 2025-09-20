import React, { useState, useEffect, useRef } from 'react';
import { PREDICTIVE_HOTSPOTS_DATA } from '../constants';
import { PredictedHotspot } from '../types';

// Leaflet is loaded from index.html, we just need to declare its type for TypeScript
declare var L: any;

const LightBulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.837a6.01 6.01 0 0 0-3 0m3 1.837V18m-3-5.25v5.25m0-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m-3 1.837V18m-3-5.25v5.25m0-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m3 1.837V18m-3-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m0 1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837M12 12.75a6.01 6.01 0 0 0 1.5-1.837a6.01 6.01 0 0 0-3 0m3 1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m-3 0a6.01 6.01 0 0 1-1.5-1.837m1.5 1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m1.5-1.837a6.01 6.01 0 0 1-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m1.5-1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m1.5-1.837a6.01 6.01 0 0 0 1.5 1.837M9 5.25a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />
    </svg>
);

const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const getRiskClasses = (risk: PredictedHotspot['predictedRisk']) => {
    switch (risk) {
        case 'High': return 'bg-red-100 text-red-700 border-red-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const HotspotCard: React.FC<{ 
    hotspot: PredictedHotspot; 
    isSelected: boolean; 
    onSelect: () => void;
}> = ({ hotspot, isSelected, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className={`bg-white p-5 rounded-xl shadow-md border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200/80'
            }`}
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800 text-lg">{hotspot.location}</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskClasses(hotspot.predictedRisk)}`}>
                    {hotspot.predictedRisk} Risk
                </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">Confidence: <span className="font-semibold text-slate-700">{hotspot.confidence}%</span></p>

            <div className="space-y-4 mb-5 flex-grow">
                <div>
                    <h5 className="text-sm font-semibold text-slate-600 mb-1">Key Factors</h5>
                    <div className="flex flex-wrap gap-1.5">
                        {hotspot.keyFactors.map(factor => (
                            <span key={factor} className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">{factor}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-slate-600 mb-1">Expected Violations</h5>
                     <div className="flex flex-wrap gap-1.5">
                        {hotspot.expectedViolations.map(violation => (
                            <span key={violation} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1.5" />
                                {violation}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-auto bg-green-50 border-t-2 border-green-200 p-4 rounded-b-lg -m-5 mt-5">
                 <h5 className="text-sm font-semibold text-green-800 mb-1 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Recommended Action
                 </h5>
                 <p className="text-sm text-green-900">{hotspot.recommendedAction}</p>
            </div>
        </div>
    );
};


type TimeFrame = keyof typeof PREDICTIVE_HOTSPOTS_DATA;

const PredictiveAnalyticsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TimeFrame>('next4Hours');
    const [selectedHotspot, setSelectedHotspot] = useState<PredictedHotspot | null>(null);
    const mapRef = useRef<any>(null); // Using 'any' for L.Map
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerLayerRef = useRef<any>(null); // Using 'any' for L.LayerGroup
    
    const tabs: { key: TimeFrame, label: string }[] = [
        { key: 'next4Hours', label: 'Next 4 Hours' },
        { key: 'tomorrowAM', label: 'Tomorrow AM' },
        { key: 'thisWeekend', label: 'This Weekend' },
    ];

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [19.0760, 72.8777], // Centered on Mumbai, India
                zoom: 10,
                scrollWheelZoom: false,
            });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapRef.current);
            markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
        }

        const map = mapRef.current;
        const markerLayer = markerLayerRef.current;

        if (!map || !markerLayer) return;

        markerLayer.clearLayers();
        const currentHotspots = PREDICTIVE_HOTSPOTS_DATA[activeTab];

        if (currentHotspots.length > 0) {
            const bounds = L.latLngBounds([]);
            currentHotspots.forEach(hotspot => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                
                const riskColorClasses = {
                    'High': 'bg-red-500',
                    'Medium': 'bg-yellow-400',
                    'Low': 'bg-green-500',
                };
                
                const riskIcon = {
                    'High': '<div class="w-2 h-2 bg-white rounded-full"></div>',
                    'Medium': '<div class="w-2 h-2 border border-white rounded-full"></div>',
                    'Low': '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>',
                }[hotspot.predictedRisk];

                const color = riskColorClasses[hotspot.predictedRisk];

                const markerHtml = `
                    <div class="relative flex items-center justify-center cursor-pointer">
                        <div class="absolute w-6 h-6 ${color} rounded-full animate-pulse opacity-20"></div>
                        ${isSelected ? `<div class="absolute w-8 h-8 ${color} rounded-full animate-ping"></div>` : ''}
                        <div class="relative flex items-center justify-center w-5 h-5 rounded-full ${color} border-2 border-white shadow-lg ${isSelected ? 'transform scale-125' : ''} transition-transform">
                           ${riskIcon}
                        </div>
                    </div>
                `;

                const icon = L.divIcon({
                    html: markerHtml,
                    className: '', // Tailwind handles styling
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker(hotspot.coords, { icon })
                    .on('click', () => {
                        setSelectedHotspot(hotspot);
                        map.flyTo(hotspot.coords, 14);
                    });
                
                marker.addTo(markerLayer);
                bounds.extend(hotspot.coords);
            });

            if (bounds.isValid() && !selectedHotspot) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        }
        
        setTimeout(() => map.invalidateSize(), 100);

    }, [activeTab, selectedHotspot]);

    const handleTabClick = (tabKey: TimeFrame) => {
        setSelectedHotspot(null);
        setActiveTab(tabKey);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center">
                    <LightBulbIcon className="w-8 h-8 mr-3 text-blue-500" />
                    Predictive Analytics
                </h2>
                <p className="text-slate-500 mt-1">AI-powered forecasts for proactive enforcement planning.</p>
            </div>
            
            <div className="mb-6">
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabClick(tab.key)}
                                className={`${
                                    activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600 font-semibold'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden h-[450px] lg:h-auto">
                     <div ref={mapContainerRef} className="w-full h-full" id="map"></div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PREDICTIVE_HOTSPOTS_DATA[activeTab].map(hotspot => (
                        <HotspotCard 
                            key={hotspot.id} 
                            hotspot={hotspot}
                            isSelected={selectedHotspot?.id === hotspot.id}
                            onSelect={() => {
                                setSelectedHotspot(hotspot);
                                if (mapRef.current) {
                                    mapRef.current.flyTo(hotspot.coords, 14);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalyticsPage;