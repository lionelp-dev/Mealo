export default function AppLogo() {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground group-data-[state=expanded]:pointer-events-none group-data-[state=expanded]:order-1 group-data-[state=expanded]:scale-0 group-data-[state=expanded]:opacity-0">
        <span className="flex h-fit flex-col text-left font-logo text-xl leading-tight font-semibold text-secondary">
          MP
        </span>
      </div>
      <span className="flex h-fit origin-top flex-col overflow-hidden text-left font-logo text-[40px] leading-tight font-semibold text-secondary group-data-[state=collapsed]:scale-y-0 group-data-[state=collapsed]:opacity-0 [&_span]:-my-[6px]">
        <span className="text-[52px]">Mealo</span>
        <span>Planner</span>
      </span>
    </>
  );
}
