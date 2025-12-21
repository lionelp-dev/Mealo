import { Meta, StoryObj } from '@storybook/react-vite';
import { DateTime } from 'luxon';
import { AppSidebarHeader } from './app-sidebar-header';
import { LanguageSwitcher } from './language-switcher';
import { SidebarProvider } from './ui/sidebar';
import WeekSelector from './week-selector';

const meta: Meta<typeof AppSidebarHeader> = {
  title: 'Meal Planner/Sidebar Header',
  component: AppSidebarHeader,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, { parameters }) => (
      <SidebarProvider defaultOpen={parameters.isOpen ?? true}>
        <div className="flex flex-1">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppSidebarHeader>;

export const MealPlanSideBarHeader: Story = {
  args: {
    headerLeftContent: (
      <WeekSelector
        currentWeek={DateTime.fromISO('2025-12-15')}
        url="/planned-meals"
      />
    ),
    headerRightContent: <LanguageSwitcher />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "En-tête avec sélecteur de semaine complet (Aujourd'hui + navigation) et changeur de langue.",
      },
    },
  },
};

export const CreateRecipeSideBarHeader: Story = {
  args: {
    headerRightContent: (
      <div className="flex gap-5">
        <button className="btn btn-primary">Créer une recette</button>
        <LanguageSwitcher />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'En-tête avec bouton "Créer une recette" et changeur de langue.',
      },
    },
  },
};

export const EditRecipeSideBarHeader: Story = {
  args: {
    headerRightContent: (
      <div className="flex gap-5">
        <div className="flex gap-3">
          <button className="btn btn-outline">Modifier</button>
          <button className="btn btn-primary">Voir mes recettes</button>
        </div>
        <LanguageSwitcher />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'En-tête avec boutons "Modifier" et "Voir mes recettes" et changeur de langue.',
      },
    },
  },
};
