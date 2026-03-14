type ShoppingListProgressProps = {
  checkedCount: number;
  totalCount: number;
};

function ShoppingListProgress({
  checkedCount,
  totalCount,
}: ShoppingListProgressProps) {
  const progressPercentage =
    totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="flex w-full shrink-0 items-center gap-5">
      <progress
        className="progress progress-secondary"
        value={progressPercentage}
        max="100"
      />
      <span className="self-end text-xs whitespace-nowrap text-base-content">
        {checkedCount} of {totalCount} completed
      </span>
    </div>
  );
}

export default ShoppingListProgress;
