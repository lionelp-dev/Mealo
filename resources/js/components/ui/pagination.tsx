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
        className="btn join-item"
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
      <button className="btn join-item">
        Page {meta.current_page} / {meta.last_page}
      </button>
      <button
        className="btn join-item"
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
