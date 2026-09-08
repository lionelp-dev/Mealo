export default function AppLogo() {
  return (
    <>
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        className="block size-8 object-contain group-data-[state=expanded]:pointer-events-none group-data-[state=expanded]:order-1 group-data-[state=expanded]:scale-0 group-data-[state=expanded]:opacity-0 max-sm:hidden"
      />
      <img
        src="/logo.svg"
        alt="Mealo Planner"
        className="block h-12 w-auto max-w-44 object-contain group-data-[state=collapsed]:scale-y-0 group-data-[state=collapsed]:opacity-0"
      />
    </>
  );
}
