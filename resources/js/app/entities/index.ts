import type { Auth } from '@/app/entities/user/types';
import type { InertiaLinkProps } from '@inertiajs/react';
import type {
  CalendarDateProps,
  CalendarMonthProps,
  CalendarMultiProps,
  CalendarRangeProps,
} from 'cally';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavItem = {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
};

export type Flash = {
  message: string | null;
  success: string | null;
  error: string | null;
  warning: string | null;
  new_workspace_id: number | null;
};

export type FlashMessage = {
  message?: string;
  success?: string;
  error?: string;
  warning?: string;
};

export type SharedData = {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  flash: Flash;
  [key: string]: unknown;
};

export type PageProps = SharedData;

export type PaginatedCollection<T> = {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string;
      label: string;
      page: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
    has_more_pages: boolean;
  };
};

export const ROLES = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type MapEvents<T> = {
  [K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K];
};

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'calendar-month': MapEvents<CalendarMonthProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-range': MapEvents<CalendarRangeProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-date': MapEvents<CalendarDateProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-multi': MapEvents<CalendarMultiProps> &
        React.HTMLAttributes<HTMLElement>;
    }
  }
}
