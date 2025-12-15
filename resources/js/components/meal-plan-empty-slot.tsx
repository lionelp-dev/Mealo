import { useMealPlanDialogControllerStore } from '@/stores/meal-plan-dialog';
import { Plus } from 'lucide-react';
import { DateTime } from 'luxon';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Banane,
  Brocoli,
  Carotte,
  Fraise,
  Orange,
  Poire,
  Pomme,
  Tomate,
} from './icons';

type MealPlanEmptySlotProps = React.ComponentProps<'div'> & {
  containerRef: RefObject<HTMLDivElement | null>;
  date: DateTime;
};

export default function MealPlanEmptySlot({
  containerRef,
  date,
  ...rest
}: MealPlanEmptySlotProps) {
  const { t } = useTranslation();
  const stickyElementRef = useRef<HTMLDivElement>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [isStickyBelowTwoThird, setIsStickyBelowTwoThird] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const checkStickyState = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight;

      if (!hasOverflow) {
        setIsStickyActive(false);
        return;
      }

      const isAtBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 1;

      if (isAtBottom) {
        setIsStickyActive(false);
      } else {
        setIsStickyActive(true);
      }
    };

    container.addEventListener('scroll', checkStickyState, { passive: true });

    const mutationObserver = new MutationObserver(checkStickyState);
    mutationObserver.observe(container, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(checkStickyState);
    resizeObserver.observe(container);

    checkStickyState();

    return () => {
      container.removeEventListener('scroll', checkStickyState);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    const stickyElem = stickyElementRef.current;

    if (!container || !stickyElem) return;

    const checkIfStickyBelowTwoThird = () => {
      const isBellow =
        stickyElem.getBoundingClientRect().top >
        container.getBoundingClientRect().top +
          container.getBoundingClientRect().height * (2 / 3);

      if (isBellow) {
        setIsStickyBelowTwoThird(true);
      } else {
        setIsStickyBelowTwoThird(false);
      }
    };

    const mutationObserver = new MutationObserver(checkIfStickyBelowTwoThird);
    mutationObserver.observe(container, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(checkIfStickyBelowTwoThird);
    resizeObserver.observe(container);

    checkIfStickyBelowTwoThird();

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [containerRef, stickyElementRef]);

  const { openMealPlanDialog } = useMealPlanDialogControllerStore();

  return (
    <div
      ref={stickyElementRef}
      className={`sticky right-0 bottom-0 left-0 flex flex-1 flex-col items-center justify-center gap-5 rounded-md py-5 text-gray-400 transition-all duration-200 ease-in-out ${
        isStickyActive ? 'bg-[#D9DADBDB]' : 'bg-gray-100'
      }`}
      {...rest}
    >
      {!isStickyBelowTwoThird && MealPlanSlotsIcons[date.weekday].icon}
      <button
        className="btn btn-primary gap-2 rounded-full !border-0 pr-5"
        onClick={() => openMealPlanDialog(date)}
      >
        <Plus size={14} />
        <span>{t('mealPlanning.actions.planMeal')}</span>
      </button>
    </div>
  );
}

const MealPlanSlotsIcons = [
  {
    icon: <Brocoli />,
  },
  {
    icon: <Fraise />,
  },
  {
    icon: <Banane />,
  },
  {
    icon: <Carotte />,
  },
  {
    icon: <Orange />,
  },
  {
    icon: <Pomme />,
  },
  {
    icon: <Poire />,
  },
  {
    icon: <Tomate />,
  },
].sort(() => Math.random() - 0.5);
