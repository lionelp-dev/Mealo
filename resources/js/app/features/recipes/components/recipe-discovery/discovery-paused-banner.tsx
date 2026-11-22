import { Typography } from '@/app/components/Typography';
import { Sparkles } from 'lucide-react';

export function DiscoveryPausedBanner({ onResume }: { onResume: () => void }) {
  return (
    <button
      type="button"
      onClick={onResume}
      className="flex w-full items-center justify-between gap-4 border-b border-base-300 bg-base-200 px-6 py-3 text-left transition hover:bg-base-300"
    >
      <span className="flex items-start gap-3">
        <Sparkles size={20} className="mt-0.5 shrink-0 text-secondary" />
        <span>
          <Typography
            as="span"
            variant="body-sm"
            tone="inherit"
            weight="semibold"
            className="block"
          >
            Mode découverte en pause
          </Typography>
          <Typography
            as="span"
            variant="body-sm"
            tone="inherit"
            className="mt-0.5 block"
          >
            Votre suggestion et vos critères sont conservés pendant que vous
            consultez cette recette.
          </Typography>
        </span>
      </span>
      <Typography
        as="span"
        variant="body-sm"
        tone="inherit"
        weight="semibold"
        className="shrink-0 underline"
      >
        Reprendre
      </Typography>
    </button>
  );
}
