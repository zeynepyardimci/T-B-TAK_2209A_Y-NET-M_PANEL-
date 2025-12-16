import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none">
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border animate-fade-in transition-all
                            ${toast.type === 'success' ? 'bg-gray-900/95 text-white border-gray-800' : 
                              toast.type === 'error' ? 'bg-red-600/95 text-white border-red-500' : 
                              'bg-white/95 text-gray-900 border-gray-200'}`}
                    >
                        {toast.type === 'success' && <span className="material-symbols-outlined text-green-400 filled text-[24px]">check_circle</span>}
                        {toast.type === 'error' && <span className="material-symbols-outlined text-white filled text-[24px]">error</span>}
                        {toast.type === 'info' && <span className="material-symbols-outlined text-primary filled text-[24px]">info</span>}
                        <p className="font-bold text-sm leading-tight">{toast.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};