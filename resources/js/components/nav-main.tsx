import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const { t } = useTranslation();

  // Function to get translated title based on the original English title
  const getTranslatedTitle = (title: string) => {
    const titleMap: { [key: string]: string } = {
      Dashboard: t('navigation.dashboard', 'Dashboard'),
      Recipes: t('navigation.recipes', 'Recipes'),
      'Meal Planning': t('navigation.mealPlanning', 'Meal Planning'),
      'Shopping Lists': t('navigation.shoppingLists', 'Shopping Lists'),
      Settings: t('navigation.settings', 'Settings'),
    };
    return titleMap[title] || title;
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>{t('navigation.platform', 'Platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={page.url.startsWith(
                typeof item.href === 'string' ? item.href : item.href.url,
              )}
              tooltip={{ children: getTranslatedTitle(item.title) }}
            >
              <Link href={item.href} prefetch>
                {item.icon && <item.icon />}
                <span>{getTranslatedTitle(item.title)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
