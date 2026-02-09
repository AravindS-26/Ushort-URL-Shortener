import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

  return (
    <div className={`fixed bottom-8 right-8 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 z-100`}>
      <div className="shrink-0">
        {icon}
      </div>
      <p className="font-semibold">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-white/20 p-1 rounded-lg transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
