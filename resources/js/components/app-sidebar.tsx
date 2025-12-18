import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import plannedMeals from '@/routes/planned-meals';
import recipes from '@/routes/recipes';
import shoppingLists from '@/routes/shopping-lists';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CookingPot, Pen, ShoppingCart, Wand } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
  const { t } = useTranslation();

  const mainNavItems: NavItem[] = [
    {
      title: t('mealPlanning.title'),
      href: plannedMeals.index.url(),
      icon: Calendar,
    },
    {
      title: t('shoppingLists.title'),
      href: shoppingLists.index.url(),
      icon: ShoppingCart,
    },
    {
      title: t('recipes.title'),
      href: recipes.index.url(),
      icon: CookingPot,
    },
    {
      title: t('recipes.create.button'),
      href: recipes.create.url(),
      icon: Pen,
    },
    {
      title: t('recipes.generate.button'),
      href: recipes.create({ query: { generate: true } }),
      icon: Wand,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
