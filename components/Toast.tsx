import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    title: string;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, title, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Trigger fade in
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500); // Wait for fade out animation to finish
        }, 4500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div 
            className={`fixed top-5 right-5 bg-gradient-to-br from-green-600 to-green-800 text-white p-4 rounded-lg shadow-2xl border-2 border-green-400 max-w-sm w-full z-[100] transition-all duration-500 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            role="alert"
            aria-live="assertive"
        >
            <h4 className="font-bold text-lg">✅ {title}</h4>
            <p className="text-sm">{message}</p>
        </div>
    );
};
