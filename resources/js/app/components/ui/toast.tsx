import { FlashMessage } from '@/app/entities/';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

type ToastItemProps = Omit<Toast, 'id'> & {
  onClose: () => void;
};

function ToastItem({ message, type, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

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
    <div className={`alert ${typeStyles[type]} z-30 mb-2`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

export default function Toast({ flash }: { flash: FlashMessage }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const newToasts: Toast[] = [];
    const timestamp = Date.now();

    if (flash.success) {
      newToasts.push({
        id: `success-${timestamp}`,
        message: flash.success,
        type: 'success',
      });
    }
    if (flash.error) {
      newToasts.push({
        id: `error-${timestamp}`,
        message: flash.error,
        type: 'error',
      });
    }
    if (flash.warning) {
      newToasts.push({
        id: `warning-${timestamp}`,
        message: flash.warning,
        type: 'warning',
      });
    }
    if (flash.message) {
      newToasts.push({
        id: `message-${timestamp}`,
        message: flash.message,
        type: 'info',
      });
    }

    if (newToasts.length > 0) {
      setToasts((prev) => [...prev, ...newToasts]);
    }
  }, [flash]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

Toast.Portal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return null;
  return createPortal(
    <div className="toast-bottom toast-end toast fixed z-60">{children}</div>,
    document.body,
  );
};
