import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const BOTTOM_SCROLL_TOLERANCE = 8;
const MOBILE_DAY_NAVIGATION_MEDIA_QUERY = '(max-width: 767px)';
const DAY_SCROLL_ANIMATION_DURATION = 450;

function easeInOutQuad(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function getDayScrollTop(
  scroller: HTMLElement,
  marker: HTMLElement,
  stickyHeight: number,
) {
  const start = scroller.scrollTop;
  const markerTop = marker.getBoundingClientRect().top;
  const scrollerTop = scroller.getBoundingClientRect().top;
  const maxScrollTop = Math.max(
    0,
    scroller.scrollHeight - scroller.clientHeight,
  );
  const target = start + markerTop - scrollerTop - stickyHeight;

  return {
    start,
    target: Math.min(Math.max(target, 0), maxScrollTop),
  };
}

function getDefaultActiveDayId(weekStart: string) {
  const currentWeekStart = DateTime.fromISO(weekStart).startOf('day');

  if (!currentWeekStart.isValid) return null;

  const today = DateTime.now();
  const todayMillis = today.toMillis();
  const weekStartMillis = currentWeekStart.toMillis();
  const weekEndMillis = currentWeekStart
    .plus({ days: 6 })
    .endOf('day')
    .toMillis();

  if (todayMillis >= weekStartMillis && todayMillis <= weekEndMillis) {
    return today.toISODate();
  }

  return currentWeekStart.toISODate();
}

function isNearScrollBottom(scroller: HTMLElement) {
  const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;

  return (
    maxScrollTop > BOTTOM_SCROLL_TOLERANCE &&
    maxScrollTop - scroller.scrollTop <= BOTTOM_SCROLL_TOLERANCE
  );
}

function getActivationLine(stickyBottom: number, isScrollingDown: boolean) {
  if (!window.matchMedia(MOBILE_DAY_NAVIGATION_MEDIA_QUERY).matches) {
    return stickyBottom + 24;
  }

  return (
    stickyBottom +
    (window.innerHeight - stickyBottom) / (isScrollingDown ? 3 : 6)
  );
}

export function useMealPlanDayNavigation(weekStart: string) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const previousScrollTopRef = useRef(0);
  const [stickyHeight, setStickyHeight] = useState(0);
  const [lastDayMinHeight, setLastDayMinHeight] = useState(0);
  const [activeDayId, setActiveDayId] = useState(() =>
    getDefaultActiveDayId(weekStart),
  );

  const dayIds = useMemo(() => {
    const currentWeekStart = DateTime.fromISO(weekStart).startOf('day');

    if (!currentWeekStart.isValid) return [];

    return Array.from({ length: 7 }, (_, index) =>
      currentWeekStart.plus({ days: index }).toISODate(),
    ).filter((dayId): dayId is string => Boolean(dayId));
  }, [weekStart]);

  useEffect(() => {
    const sticky = stickyRef.current;

    if (!sticky) return;

    const updateStickyHeight = () => {
      setStickyHeight(sticky.getBoundingClientRect().height);
    };

    updateStickyHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(updateStickyHeight);
    resizeObserver.observe(sticky);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setActiveDayId(getDefaultActiveDayId(weekStart));
  }, [weekStart]);

  useEffect(() => {
    const scroller = contentRef.current;
    const mediaQueryList = window.matchMedia(MOBILE_DAY_NAVIGATION_MEDIA_QUERY);

    if (!scroller) return;

    const updateLastDayMinHeight = () => {
      setLastDayMinHeight(
        mediaQueryList.matches
          ? Math.max(0, scroller.clientHeight - stickyHeight)
          : 0,
      );
    };

    updateLastDayMinHeight();

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateLastDayMinHeight);

    resizeObserver?.observe(scroller);
    window.addEventListener('resize', updateLastDayMinHeight);
    mediaQueryList.addEventListener('change', updateLastDayMinHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateLastDayMinHeight);
      mediaQueryList.removeEventListener('change', updateLastDayMinHeight);
    };
  }, [stickyHeight]);

  const syncActiveDayWithScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;

    const scroller = contentRef.current;
    const lastDayId = dayIds[dayIds.length - 1] ?? null;

    if (!scroller) return;

    const isScrollingDown = scroller.scrollTop > previousScrollTopRef.current;
    previousScrollTopRef.current = scroller.scrollTop;

    if (lastDayId && isNearScrollBottom(scroller)) {
      setActiveDayId(lastDayId);
      return;
    }

    const stickyBottom = stickyRef.current?.getBoundingClientRect().bottom ?? 0;
    const activationLine = getActivationLine(stickyBottom, isScrollingDown);
    let nextActiveDayId = dayIds[0] ?? null;

    for (const dayId of dayIds) {
      const marker = document.getElementById(`planning-day-marker-${dayId}`);

      if (!marker) continue;

      if (marker.getBoundingClientRect().top <= activationLine) {
        nextActiveDayId = dayId;
        continue;
      }

      break;
    }

    setActiveDayId((currentActiveDayId) =>
      nextActiveDayId && nextActiveDayId !== currentActiveDayId
        ? nextActiveDayId
        : currentActiveDayId,
    );
  }, [dayIds]);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    let animationFrame: number | null = null;

    const scheduleActiveDaySync = () => {
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        syncActiveDayWithScroll();
      });
    };

    content.addEventListener('scroll', scheduleActiveDaySync, {
      passive: true,
    });
    window.addEventListener('resize', scheduleActiveDaySync);
    scheduleActiveDaySync();

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      content.removeEventListener('scroll', scheduleActiveDaySync);
      window.removeEventListener('resize', scheduleActiveDaySync);
    };
  }, [syncActiveDayWithScroll]);

  useEffect(() => {
    return () => {
      if (scrollAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
    };
  }, []);

  const handleSelectDay = useCallback(
    (dayId: string) => {
      if (isProgrammaticScrollRef.current) return;

      const scroller = contentRef.current;
      const marker = document.getElementById(`planning-day-marker-${dayId}`);

      if (!scroller || !marker) return;

      setActiveDayId(dayId);

      const { start, target } = getDayScrollTop(scroller, marker, stickyHeight);

      if (target === start || prefersReducedMotion()) {
        scroller.scrollTop = target;
        previousScrollTopRef.current = target;
        return;
      }

      // Keep ownership of scrollTop during the whole animation.
      isProgrammaticScrollRef.current = true;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(
          1,
          (now - startTime) / DAY_SCROLL_ANIMATION_DURATION,
        );

        scroller.scrollTop = start + (target - start) * easeInOutQuad(progress);

        if (progress < 1) {
          scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        scrollAnimationFrameRef.current = null;
        previousScrollTopRef.current = target;
        isProgrammaticScrollRef.current = false;
      };

      scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
    },
    [stickyHeight],
  );

  return {
    activeDayId,
    stickyRef,
    stickyHeight,
    lastDayMinHeight,
    contentRef,
    handleSelectDay,
  };
}
