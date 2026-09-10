import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';
import { cn } from '@/app/lib';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const { t } = useTranslation();
  const currentPath = page.url.split('?')[0];

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupLabel className="text-secondary uppercase">
        {t('navigation.platform', 'Platform')}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const href = typeof item.href === 'string' ? item.href : item.href.url;
          const itemPath = href.split('?')[0];
          const isExactActive = currentPath === itemPath;
          const isNestedActive =
            !isExactActive && currentPath.startsWith(`${itemPath}/`);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isExactActive || isNestedActive}
                className={cn(
                  isNestedActive &&
                    'data-[active=true]:bg-secondary/15 data-[active=true]:text-base-content data-[active=true]:hover:bg-secondary/20 data-[active=true]:hover:text-base-content',
                )}
                tooltip={{ children: item.title }}
              >
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
