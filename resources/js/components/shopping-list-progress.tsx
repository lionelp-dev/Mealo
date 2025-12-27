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
    <div className="w-full flex-col px-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-md font-medium text-base-content">
          Shopping list progress
        </span>
        <span className="text-sm text-base-content">
          {checkedCount} of {totalCount} completed
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-base-300">
        <div
          className="h-2 rounded-full bg-success transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default ShoppingListProgress;
