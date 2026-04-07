import AppLogo from './app-logo';
import { BetaWarningBanner } from './beta-warning-banner';
import { NavWorkspace } from './nav-workspace';
import { NavMain } from '@/app/components/nav-main';
import { NavUser } from '@/app/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';
import { dashboard } from '@/routes';
import plannedMeals from '@/routes/planned-meals';
import recipes from '@/routes/recipes';
import shoppingLists from '@/routes/shopping-lists';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CookingPot, Pen, ShoppingCart, Wand } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AppSidebar() {
  const { t } = useTranslation();

  const mainNavItems: NavItem[] = [
    {
      title: t('mealPlanning.title', 'Meal Planning'),
      href: plannedMeals.index.url(),
      icon: Calendar,
    },
    {
      title: t('shoppingLists.title', 'Shopping Lists'),
      href: shoppingLists.index.url(),
      icon: ShoppingCart,
    },
    {
      title: t('recipes.title', 'Recipes'),
      href: recipes.index.url(),
      icon: CookingPot,
    },
    {
      title: t('recipes.create.button', 'Create recipe'),
      href: recipes.create.url(),
      icon: Pen,
    },
    {
      title: t('recipes.generate.button', 'Generate recipe'),
      href: recipes.create({
        query: { show_generate_recipe_with_ai_modal: true },
      }),
      icon: Wand,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-fit">
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
        <NavWorkspace />
      </SidebarContent>

      <SidebarFooter>
        <BetaWarningBanner />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
