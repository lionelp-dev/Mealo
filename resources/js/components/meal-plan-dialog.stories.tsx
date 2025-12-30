import { Meta, StoryObj } from '@storybook/react-vite';
import { DateTime } from 'luxon';
import { MealPlanProvider } from '../contexts/meal-plan-context';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import {
  Ingredient,
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Step,
  Tag,
} from '../types';
import MealPlanDialog from './meal-plan-dialog';
import MealPlanDialogRecipes from './meal-plan-dialog-recipes';

// Mock data
const mealTimes: MealTime[] = [
  { id: 1, name: 'breakfast' },
  { id: 2, name: 'lunch' },
  { id: 3, name: 'diner' },
];

const tags: Tag[] = [
  { id: 1, name: 'végétarien' },
  { id: 2, name: 'rapide' },
  { id: 3, name: 'familial' },
  { id: 4, name: 'santé' },
];

const ingredients: Ingredient[] = [
  { id: 1, name: 'Œufs', quantity: 2, unit: 'pièce' },
  { id: 2, name: 'Farine', quantity: 200, unit: 'g' },
  { id: 3, name: 'Lait', quantity: 300, unit: 'ml' },
  { id: 4, name: 'Tomates', quantity: 4, unit: 'pièce' },
  { id: 5, name: 'Mozzarella', quantity: 200, unit: 'g' },
];

const steps: Step[] = [
  { id: 1, order: 1, description: 'Préchauffer le four à 180°C' },
  { id: 2, order: 2, description: 'Mélanger tous les ingrédients' },
  { id: 3, order: 3, description: 'Cuire pendant 20 minutes' },
];

const sampleRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Crêpes aux fruits',
    description: 'Délicieuses crêpes garnies de fruits frais',
    preparation_time: 15,
    cooking_time: 20,
    meal_times: [mealTimes[0]],
    ingredients: ingredients.slice(0, 3),
    steps: steps,
    tags: [tags[1], tags[3]],
  },
  {
    id: 2,
    name: 'Salade Caprese',
    description: 'Salade italienne aux tomates et mozzarella',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[1]],
    ingredients: ingredients.slice(3, 5),
    steps: [
      {
        id: 4,
        order: 1,
        description: 'Couper les tomates et la mozzarella en tranches',
      },
    ],
    tags: [tags[0], tags[1]],
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    description: 'Pâtes crémeuses aux lardons',
    preparation_time: 5,
    cooking_time: 15,
    meal_times: [mealTimes[2]],
    ingredients: [
      { id: 6, name: 'Pâtes', quantity: 400, unit: 'g' },
      { id: 7, name: 'Lardons', quantity: 200, unit: 'g' },
      { id: 8, name: 'Crème fraîche', quantity: 200, unit: 'ml' },
    ],
    steps: [
      { id: 5, order: 1, description: 'Faire cuire les pâtes' },
      { id: 6, order: 2, description: 'Faire revenir les lardons' },
      { id: 7, order: 3, description: 'Mélanger avec la crème' },
    ],
    tags: [tags[2]],
  },
  {
    id: 4,
    name: 'Smoothie Bowl',
    description: 'Bowl énergétique aux fruits',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[0]],
    ingredients: [
      { id: 9, name: 'Banane', quantity: 2, unit: 'pièce' },
      { id: 10, name: 'Fruits rouges', quantity: 100, unit: 'g' },
      { id: 11, name: 'Granola', quantity: 50, unit: 'g' },
    ],
    steps: [
      { id: 8, order: 1, description: 'Mixer les fruits' },
      { id: 9, order: 2, description: 'Ajouter le granola' },
    ],
    tags: [tags[0], tags[3]],
  },
  {
    id: 2,
    name: 'Salade Caprese',
    description: 'Salade italienne aux tomates et mozzarella',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[1]],
    ingredients: ingredients.slice(3, 5),
    steps: [
      {
        id: 4,
        order: 1,
        description: 'Couper les tomates et la mozzarella en tranches',
      },
    ],
    tags: [tags[0], tags[1]],
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    description: 'Pâtes crémeuses aux lardons',
    preparation_time: 5,
    cooking_time: 15,
    meal_times: [mealTimes[2]],
    ingredients: [
      { id: 6, name: 'Pâtes', quantity: 400, unit: 'g' },
      { id: 7, name: 'Lardons', quantity: 200, unit: 'g' },
      { id: 8, name: 'Crème fraîche', quantity: 200, unit: 'ml' },
    ],
    steps: [
      { id: 5, order: 1, description: 'Faire cuire les pâtes' },
      { id: 6, order: 2, description: 'Faire revenir les lardons' },
      { id: 7, order: 3, description: 'Mélanger avec la crème' },
    ],
    tags: [tags[2]],
  },
  {
    id: 4,
    name: 'Smoothie Bowl',
    description: 'Bowl énergétique aux fruits',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[0]],
    ingredients: [
      { id: 9, name: 'Banane', quantity: 2, unit: 'pièce' },
      { id: 10, name: 'Fruits rouges', quantity: 100, unit: 'g' },
      { id: 11, name: 'Granola', quantity: 50, unit: 'g' },
    ],
    steps: [
      { id: 8, order: 1, description: 'Mixer les fruits' },
      { id: 9, order: 2, description: 'Ajouter le granola' },
    ],
    tags: [tags[0], tags[3]],
  },
  {
    id: 2,
    name: 'Salade Caprese',
    description: 'Salade italienne aux tomates et mozzarella',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[1]],
    ingredients: ingredients.slice(3, 5),
    steps: [
      {
        id: 4,
        order: 1,
        description: 'Couper les tomates et la mozzarella en tranches',
      },
    ],
    tags: [tags[0], tags[1]],
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    description: 'Pâtes crémeuses aux lardons',
    preparation_time: 5,
    cooking_time: 15,
    meal_times: [mealTimes[2]],
    ingredients: [
      { id: 6, name: 'Pâtes', quantity: 400, unit: 'g' },
      { id: 7, name: 'Lardons', quantity: 200, unit: 'g' },
      { id: 8, name: 'Crème fraîche', quantity: 200, unit: 'ml' },
    ],
    steps: [
      { id: 5, order: 1, description: 'Faire cuire les pâtes' },
      { id: 6, order: 2, description: 'Faire revenir les lardons' },
      { id: 7, order: 3, description: 'Mélanger avec la crème' },
    ],
    tags: [tags[2]],
  },
  {
    id: 4,
    name: 'Smoothie Bowl',
    description: 'Bowl énergétique aux fruits',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[0]],
    ingredients: [
      { id: 9, name: 'Banane', quantity: 2, unit: 'pièce' },
      { id: 10, name: 'Fruits rouges', quantity: 100, unit: 'g' },
      { id: 11, name: 'Granola', quantity: 50, unit: 'g' },
    ],
    steps: [
      { id: 8, order: 1, description: 'Mixer les fruits' },
      { id: 9, order: 2, description: 'Ajouter le granola' },
    ],
    tags: [tags[0], tags[3]],
  },
  {
    id: 2,
    name: 'Salade Caprese',
    description: 'Salade italienne aux tomates et mozzarella',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[1]],
    ingredients: ingredients.slice(3, 5),
    steps: [
      {
        id: 4,
        order: 1,
        description: 'Couper les tomates et la mozzarella en tranches',
      },
    ],
    tags: [tags[0], tags[1]],
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    description: 'Pâtes crémeuses aux lardons',
    preparation_time: 5,
    cooking_time: 15,
    meal_times: [mealTimes[2]],
    ingredients: [
      { id: 6, name: 'Pâtes', quantity: 400, unit: 'g' },
      { id: 7, name: 'Lardons', quantity: 200, unit: 'g' },
      { id: 8, name: 'Crème fraîche', quantity: 200, unit: 'ml' },
    ],
    steps: [
      { id: 5, order: 1, description: 'Faire cuire les pâtes' },
      { id: 6, order: 2, description: 'Faire revenir les lardons' },
      { id: 7, order: 3, description: 'Mélanger avec la crème' },
    ],
    tags: [tags[2]],
  },
  {
    id: 4,
    name: 'Smoothie Bowl',
    description: 'Bowl énergétique aux fruits',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[0]],
    ingredients: [
      { id: 9, name: 'Banane', quantity: 2, unit: 'pièce' },
      { id: 10, name: 'Fruits rouges', quantity: 100, unit: 'g' },
      { id: 11, name: 'Granola', quantity: 50, unit: 'g' },
    ],
    steps: [
      { id: 8, order: 1, description: 'Mixer les fruits' },
      { id: 9, order: 2, description: 'Ajouter le granola' },
    ],
    tags: [tags[0], tags[3]],
  },
];

const recipes: PaginatedCollection<Recipe> = {
  data: sampleRecipes,
  links: { first: '', last: '', prev: '', next: '' },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 20,
    to: sampleRecipes.length,
    total: sampleRecipes.length,
    has_more_pages: false,
  },
};

const plannedMeals: PlannedMeal[] = [
  {
    id: 1,
    planned_date: '2024-01-15',
    meal_time_id: 1,
    recipe: { id: 1, name: 'Crêpes aux fruits' },
  },
  {
    id: 2,
    planned_date: '2024-01-16',
    meal_time_id: 2,
    recipe: { id: 2, name: 'Salade Caprese' },
  },
];

const contextData = {
  weekStart: '2024-01-15',
  mealTimes,
  plannedMeals,
  recipes,
  tags,
};

const meta: Meta<typeof MealPlanDialog> = {
  title: 'Meal Planner/MealPlanDialog',
  component: MealPlanDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Dialog de planification des repas permettant de sélectionner des recettes et de les assigner à un créneau de repas pour une date donnée.',
      },
    },
  },
  args: {
    children: (
      <div className="overflow-y-scroll">
        <MealPlanDialogRecipes />
      </div>
    ),
  },
  decorators: [
    (Story, context) => (
      <div className="min-h-screen bg-gray-50">
        <MealPlanProvider data={contextData}>
          <Story {...context.args} />
        </MealPlanProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MealPlanDialog>;

export const Default: Story = {
  render: (args) => {
    useMealPlanDialogStore
      .getState()
      .openMealPlanDialog(DateTime.fromISO('2024-01-15'));

    return <MealPlanDialog {...args} />;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Dialog ouvert montrant la liste des recettes disponibles pour planification.',
      },
    },
  },
};
