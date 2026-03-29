import { RecipeResource } from '../data/resources/recipe/types';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { Filter } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function useUrlFilterSync() {
  const { tags } = usePage<{ tags: RecipeResource['tags'] }>().props;
  const { addFilter, clearAllFilters } = useRecipesFiltersStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const filters: Filter[] = [];

    // Parse meal_times from URL - handle both encoded and normal formats
    const mealTimes: string[] = [];

    // Try different parameter formats
    for (let i = 0; i < 10; i++) {
      const mealTime =
        params.get(`meal_times[${i}]`) || params.get(`meal_times%5B${i}%5D`);
      if (mealTime) mealTimes.push(mealTime);
    }

    mealTimes.forEach((mealTimeId: string) => {
      const mealTimeLabels = {
        '1': 'breakfast',
        '2': 'lunch',
        '3': 'dinner',
        '4': 'snack',
      };

      if (mealTimeLabels[mealTimeId as keyof typeof mealTimeLabels]) {
        filters.push({
          type: 'meal_time',
          value: mealTimeId,
          label: mealTimeLabels[mealTimeId as keyof typeof mealTimeLabels],
        });
      }
    });

    // Parse tags from URL - handle both encoded and normal formats
    const tagIds: string[] = [];

    // Try different parameter formats
    for (let i = 0; i < 20; i++) {
      const tagId = params.get(`tags[${i}]`) || params.get(`tags%5B${i}%5D`);
      if (tagId) tagIds.push(tagId);
    }

    tagIds.forEach((tagId: string) => {
      const tag = tags?.find((t) => t.id?.toString() === tagId);
      if (tag) {
        filters.push({
          type: 'tag',
          value: tag.id?.toString() ?? '',
          label: tag.name,
        });
      }
    });

    // Parse preparation_time from URL
    const preparationTime = params.get('preparation_time');
    if (preparationTime) {
      filters.push({
        type: 'preparation_time',
        value: preparationTime,
        label: preparationTime,
      });
    }

    // Parse cooking_time from URL
    const cookingTime = params.get('cooking_time');
    if (cookingTime) {
      filters.push({
        type: 'cooking_time',
        value: cookingTime,
        label: cookingTime,
      });
    }

    // Clear existing filters and add URL filters
    if (filters.length > 0) {
      clearAllFilters();
      filters.forEach((filter) => addFilter(filter));
    }

    isInitialized.current = true;
  }, [tags, addFilter, clearAllFilters]);

  return { isInitialized: isInitialized.current };
}
