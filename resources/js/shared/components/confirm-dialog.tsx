import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Prettify } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  submitBtnLabel: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  submitBtnLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader className="flex flex-col">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3">
          <button className="btn btn-error" onClick={onConfirm}>
            {submitBtnLabel}
          </button>
          <button className="btn" onClick={onCancel}>
            {t('common.buttons.cancel', 'Cancel')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<
    ConfirmDialogProps,
    'isOpen'
  > | null>(null);

  const confirm = (configObj: Prettify<Omit<ConfirmDialogProps, 'isOpen'>>) => {
    setConfig(configObj);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config?.onConfirm?.();
    setIsOpen(false);
    setConfig(null);
  };

  const handleCancel = () => {
    config?.onCancel?.();
    setIsOpen(false);
    setConfig(null);
  };

  return {
    confirm,
    dialogProps: config
      ? ({
          isOpen,
          title: config.title,
          submitBtnLabel: config.submitBtnLabel,
          message: config.message,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        } satisfies ConfirmDialogProps)
      : null,
  };
};
