import { Typography } from '@/app/components/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useAppearance } from '@/app/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();

  const getCurrentIcon = () => {
    switch (appearance) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'light':
        return <Sun className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="btn btn-square h-9 w-9 rounded-md btn-ghost">
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => updateAppearance('light')}>
            <Typography
              as="span"
              variant="body-sm"
              className="flex items-center gap-2"
            >
              <Sun className="h-5 w-5" />
              Light
            </Typography>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateAppearance('dark')}>
            <Typography
              as="span"
              variant="body-sm"
              className="flex items-center gap-2"
            >
              <Moon className="h-5 w-5" />
              Dark
            </Typography>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateAppearance('system')}>
            <Typography
              as="span"
              variant="body-sm"
              className="flex items-center gap-2"
            >
              <Monitor className="h-5 w-5" />
              System
            </Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
