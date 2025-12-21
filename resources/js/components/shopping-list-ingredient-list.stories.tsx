import { Meta, StoryObj } from '@storybook/react-vite';
import { ShoppingListIngredient } from '../types';
import ShoppingListIngredientList from './shopping-list-ingredient-list';

const createMockIngredient = (
  id: number,
  name: string,
  quantity: number,
  unit: string,
  isChecked = false,
): ShoppingListIngredient => ({
  id,
  shopping_list_id: 1,
  ingredient_id: id,
  ingredient: {
    id,
    name,
  },
  quantity,
  unit,
  is_checked: isChecked,
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
});

const sampleIngredients: ShoppingListIngredient[] = [
  createMockIngredient(1, 'Tomates', 3, 'pièces'),
  createMockIngredient(2, 'Farine', 500, 'g', true),
  createMockIngredient(3, 'Lait', 1, 'l'),
  createMockIngredient(4, 'Œufs', 6, 'pièces', true),
  createMockIngredient(5, 'Fromage râpé', 200, 'g'),
];

const meta: Meta<typeof ShoppingListIngredientList> = {
  title: 'Shopping List/ShoppingListIngredientList',
  component: ShoppingListIngredientList,
  parameters: {
    docs: {
      description: {
        component:
          'Liste des ingrédients de courses avec cases à cocher pour marquer les éléments comme achetés.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-80 w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShoppingListIngredientList>;

export const Empty: Story = {
  args: {
    title: 'Aucun ingrédient',
    description: 'Votre liste de courses est vide',
    ingredients: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Liste vide sans ingrédients.',
      },
    },
  },
};

export const AllChecked: Story = {
  args: {
    title: 'Courses terminées',
    description: 'Tous les ingrédients ont été achetés',
    ingredients: sampleIngredients.map((ingredient) => ({
      ...ingredient,
      is_checked: true,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Liste avec tous les ingrédients cochés.',
      },
    },
  },
};

export const NoneChecked: Story = {
  args: {
    title: 'Courses à faire',
    description: 'Aucun ingrédient acheté pour le moment',
    ingredients: sampleIngredients.map((ingredient) => ({
      ...ingredient,
      is_checked: false,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Liste avec aucun ingrédient coché.',
      },
    },
  },
};
