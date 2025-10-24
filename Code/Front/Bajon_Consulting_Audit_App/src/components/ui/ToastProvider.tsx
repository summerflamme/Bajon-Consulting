import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((s) => [...s, { id, message, type }]);
    // auto remove
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value = {
    success: (message: string) => add(message, 'success'),
    error: (message: string) => add(message, 'error'),
    info: (message: string) => add(message, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-portal" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type ?? 'info'}`}>
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
