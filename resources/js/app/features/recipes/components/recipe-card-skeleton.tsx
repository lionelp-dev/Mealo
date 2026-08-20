export function RecipeCardSkeleton() {
  return (
    <div
      className="card pointer-events-none overflow-hidden rounded-md bg-base-100 shadow-lg card-sm"
      aria-hidden="true"
    >
      <div className="relative">
        <figure className="h-42">
          <div className="h-full w-full skeleton rounded-none" />
        </figure>

        <div className="absolute right-0 bottom-0 left-0 flex max-h-[1.5lh] gap-2 overflow-hidden px-2 py-2">
          <div className="h-5 w-16 skeleton rounded-full bg-base-100/70" />
          <div className="h-5 w-20 skeleton rounded-full bg-base-100/70" />
        </div>
      </div>

      <div className="card-body">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-5 w-3/4 skeleton" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-5/6 skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
