import { Meta, StoryObj } from '@storybook/react-vite';
import ShoppingListProgress from './shopping-list-progress';

const meta: Meta<typeof ShoppingListProgress> = {
  title: 'Shopping List/ShoppingListProgress',
  component: ShoppingListProgress,
  parameters: {
    docs: {
      description: {
        component:
          'Composant affichant la progression des éléments cochés dans une liste de courses avec barre de progression.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-7xl py-5">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShoppingListProgress>;

export const Empty: Story = {
  args: {
    checkedCount: 0,
    totalCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Liste vide sans éléments.',
      },
    },
  },
};

export const NothingChecked: Story = {
  args: {
    checkedCount: 0,
    totalCount: 15,
  },
  parameters: {
    docs: {
      description: {
        story: 'Aucun élément coché dans une liste de 15 éléments.',
      },
    },
  },
};

export const PartiallyCompleted: Story = {
  args: {
    checkedCount: 7,
    totalCount: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progression partielle avec 7 éléments cochés sur 12.',
      },
    },
  },
};

export const FullyCompleted: Story = {
  args: {
    checkedCount: 8,
    totalCount: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progression complète - tous les éléments sont cochés.',
      },
    },
  },
};
