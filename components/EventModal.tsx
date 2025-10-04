import React from 'react';
import { GameEvent, Resource } from '../types';

interface EventModalProps {
    event: GameEvent;
    onChoice: (consequences: { resource: Resource; amount: number }[]) => void;
    onClose: () => void;
}

const ConsequenceDisplay: React.FC<{ consequence: { resource: Resource; amount: number } }> = ({ consequence }) => {
    const isPositive = consequence.amount >= 0;
    return (
        <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{consequence.amount.toLocaleString('id-ID')} {consequence.resource}
        </span>
    );
};

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border-2 border-purple-500 max-w-2xl w-full animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2 text-purple-300">{event.title}</h2>
                    <p className="text-lg mb-8 text-gray-300">{event.description}</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {event.choices.map((choice, index) => (
                        <button
                            key={index}
                            onClick={() => onChoice(choice.consequences)}
                            className="bg-gray-700 p-6 rounded-lg text-white font-bold w-full text-left hover:bg-purple-800 transition-colors duration-200 border border-gray-600 hover:border-purple-500"
                        >
                            <p className="text-lg mb-3">{choice.text}</p>
                            <div className="text-sm space-y-1">
                                {choice.consequences.map((c, i) => (
                                    <ConsequenceDisplay key={i} consequence={c} />
                                ))}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center mt-8">
                     <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Abaikan Peristiwa
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
