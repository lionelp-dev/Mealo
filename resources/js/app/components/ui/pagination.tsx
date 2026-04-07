import recipes from '@/routes/recipes';
import { PaginatedCollection } from '@/types';
import { router } from '@inertiajs/react';

export function Pagination({
  meta,
}: {
  meta: PaginatedCollection<unknown>['meta'];
}) {
  return (
    <div className="join self-center">
      <button
        className="btn join-item btn-ghost"
        disabled={meta.current_page === 1}
        onClick={() =>
          router.visit(
            recipes.index.url({
              query: { page: meta.current_page - 1 },
            }),
          )
        }
      >
        «
      </button>
      <span className="join-item flex items-center px-3">
        Page {meta.current_page} / {meta.last_page}
      </span>
      <button
        className="btn join-item btn-ghost"
        disabled={!meta.has_more_pages}
        onClick={() =>
          router.visit(
            recipes.index.url({
              query: { page: meta.current_page + 1 },
            }),
          )
        }
      >
        »
      </button>
    </div>
  );
}
