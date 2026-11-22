import { Typography } from '@/app/components/Typography';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { useInitials } from '@/app/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
  user,
  showEmail = false,
}: {
  user: User;
  showEmail?: boolean;
}) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <Typography
          as="span"
          variant="body-sm"
          weight="medium"
          className="truncate"
        >
          {user.name}
        </Typography>
        {showEmail && (
          <Typography
            as="span"
            variant="caption"
            tone="muted"
            className="truncate"
          >
            {user.email}
          </Typography>
        )}
      </div>
    </>
  );
}
