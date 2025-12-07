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
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Plannification de repas',
    href: plannedMeals.index.url(),
    icon: Calendar,
  },
  {
    title: 'Mes listes de courses',
    href: shoppingLists.index.url(),
    icon: ShoppingCart,
  },
  {
    title: 'Mes recettes',
    href: recipes.index.url(),
    icon: CookingPot,
  },
  {
    title: 'Creer une recette',
    href: recipes.create.url(),
    icon: Pen,
  },
  {
    title: 'Generer une recette',
    href: recipes.create.url(),
    icon: Wand,
  },
];

export function AppSidebar() {
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
