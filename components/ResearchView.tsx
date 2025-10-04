import React from 'react';

// This is a placeholder component. A full implementation would involve
// state management for technologies, costs, timers, and dependencies.
export const ResearchView: React.FC = () => {
    const techTree = [
        { name: "Kemajuan", description: "Tingkatkan produksi sumber daya, kecepatan mengumpulkan, dan kecepatan konstruksi.", icon: "📈", unlocked: true },
        { name: "Militer", description: "Tingkatkan serangan, pertahanan, dan HP pasukanmu.", icon: "⚔️", unlocked: true },
        { name: "Pertahanan", description: "Tingkatkan pertahanan kota, daya tahan benteng, dan efektivitas jebakan.", icon: "🛡️", unlocked: false },
        { name: "Medis", description: "Tingkatkan kapasitas Tabib dan kecepatan penyembuhan.", icon: "⚕️", unlocked: false },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Perguruan - Pohon Teknologi</h1>
            <p className="mb-8 text-gray-300">Teliti teknologi baru untuk memperkuat kerajaanmu. (Ini adalah placeholder visual).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {techTree.map(tech => (
                    <div key={tech.name} className={`bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg border border-blue-700 ${!tech.unlocked ? 'opacity-50' : ''}`}>
                        <div className="flex items-center mb-3">
                            <span className="text-4xl mr-4">{tech.icon}</span>
                            <div>
                                <h3 className="text-xl font-bold text-blue-300">{tech.name}</h3>
                                {!tech.unlocked && <span className="text-xs text-red-400">Terkunci</span>}
                            </div>
                        </div>
                        <p className="text-gray-400">{tech.description}</p>
                         <button disabled={!tech.unlocked} className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                            Lihat Pohon
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
