import { cn } from '@/app/lib';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

export const typographyVariants = cva('font-sans text-foreground', {
  variants: {
    variant: {
      display: 'text-5xl font-semibold tracking-tight leading-none',
      heading: 'text-3xl font-semibold tracking-tighter leading-tight',
      title: 'text-xl font-semibold tracking-tighter leading-tight',
      'body-xs': 'text-xs leading-4',
      'body-sm': 'text-sm -tracking-[0.02rem] leading-5',
      body: 'text-base tracking-tight leading-5.25',
      'body-lg': 'text-lg leading-7 tracking-tight',
      'body-xl': 'text-xl leading-7 tracking-tighter',
      'body-2xl': 'text-2xl leading-8 tracking-tighter',
      label: 'text-sm font-medium leading-5',
      caption: 'text-xs leading-4',
      overline: 'text-xs font-semibold leading-4 tracking-thighter uppercase',
      code: 'font-mono text-xs leading-4',
      quote: 'text-lg leading-7 italic',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      inverse: 'text-primary-foreground',
      inherit: 'text-inherit',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  compoundVariants: [
    {
      variant: 'heading',
      size: ['3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'],
      className: 'leading-none tracking-tight',
    },
    {
      variant: 'body',
      size: 'xs',
      className: 'leading-4',
    },
    {
      variant: 'body',
      size: 'sm',
      className: 'leading-5',
    },
  ],
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});

type TypographyOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
};

export type TypographyProps<T extends ElementType = 'p'> =
  TypographyOwnProps<T> &
    VariantProps<typeof typographyVariants> &
    Omit<
      ComponentPropsWithoutRef<T>,
      keyof TypographyOwnProps<T> | 'variant' | 'size' | 'tone' | 'weight'
    >;

export function Typography<T extends ElementType = 'p'>({
  as,
  variant,
  size,
  tone,
  weight,
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? 'p';

  return (
    <Component
      className={cn(
        typographyVariants({ variant, size, tone, weight }),
        className,
      )}
      {...props}
    >
      {props.children}
    </Component>
  );
}
