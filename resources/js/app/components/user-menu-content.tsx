import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { UserInfo } from '@/app/components/user-info';
import { type User } from '@/app/entities/user/types';
import { useMobileNavigation } from '@/app/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const { t } = useTranslation();
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="flex w-full justify-start"
            href={edit()}
            as="button"
            prefetch
            onClick={cleanup}
          >
            <Settings />
            {t('navigation.settings', 'Settings')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          className="flex w-full justify-start"
          href={logout()}
          as="button"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut />
          {t('auth.verifyEmail.logoutButton', 'Log out')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
