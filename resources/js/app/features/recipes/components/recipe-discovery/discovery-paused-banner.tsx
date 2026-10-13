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
          <span className="block font-semibold">Mode découverte en pause</span>
          <span className="mt-0.5 block text-sm text-base-content/60">
            Votre suggestion et vos critères sont conservés pendant que vous
            consultez cette recette.
          </span>
        </span>
      </span>
      <span className="shrink-0 text-sm font-semibold underline">
        Reprendre
      </span>
    </button>
  );
}
