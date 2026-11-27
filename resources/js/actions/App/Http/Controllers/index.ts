import Admin from './Admin';
import Auth from './Auth';
import DemoController from './DemoController';
import PlannedMealController from './PlannedMealController';
import RecipeController from './RecipeController';
import Settings from './Settings';
import ShoppingListController from './ShoppingListController';
import WorkspaceController from './WorkspaceController';
import WorkspaceInvitationController from './WorkspaceInvitationController';

const Controllers = {
  Auth: Object.assign(Auth, Auth),
  DemoController: Object.assign(DemoController, DemoController),
  RecipeController: Object.assign(RecipeController, RecipeController),
  PlannedMealController: Object.assign(
    PlannedMealController,
    PlannedMealController,
  ),
  ShoppingListController: Object.assign(
    ShoppingListController,
    ShoppingListController,
  ),
  WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
  WorkspaceInvitationController: Object.assign(
    WorkspaceInvitationController,
    WorkspaceInvitationController,
  ),
  Settings: Object.assign(Settings, Settings),
  Admin: Object.assign(Admin, Admin),
};

export default Controllers;
