import { FlashMessage } from '@/types';
import { useEffect, useState } from 'react';

type Toast = { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' };

type ToastItemProps = Omit<Toast, 'id'> & {
  onClose: () => void;
};

function ToastItem({ message, type, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles: Record<Toast['type'], string> = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  const icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="toast-end toast">
      <div className={`alert ${typeStyles[type]}`}>
        <span>{icons[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function Toast({ flash }: { flash: FlashMessage }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const newToasts: Toast[] = [];

    if (flash.success) {
      newToasts.push({ id: 'success', message: flash.success, type: 'success' });
    }
    if (flash.error) {
      newToasts.push({ id: 'error', message: flash.error, type: 'error' });
    }
    if (flash.warning) {
      newToasts.push({ id: 'warning', message: flash.warning, type: 'warning' });
    }
    if (flash.message) {
      newToasts.push({ id: 'message', message: flash.message, type: 'info' });
    }

    if (newToasts.length > 0) {
      setToasts(newToasts);
    }
  }, [flash]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

