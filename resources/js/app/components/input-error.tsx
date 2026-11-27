import { Typography } from '@/app/components/Typography';
import { type HTMLAttributes } from 'react';

export default function InputError({
  message,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
  return message ? (
    <Typography
      as="p"
      variant="body-sm"
      tone="error"
      {...props}
      className={className}
    >
      {message}
    </Typography>
  ) : null;
}
