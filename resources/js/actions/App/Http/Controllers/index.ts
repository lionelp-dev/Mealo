import Auth from './Auth'
import BetaRequestController from './BetaRequestController'
import RecipeController from './RecipeController'
import PlannedMealController from './PlannedMealController'
import ShoppingListController from './ShoppingListController'
import WorkspaceController from './WorkspaceController'
import WorkspaceInvitationController from './WorkspaceInvitationController'
import Settings from './Settings'
import Admin from './Admin'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    BetaRequestController: Object.assign(BetaRequestController, BetaRequestController),
    RecipeController: Object.assign(RecipeController, RecipeController),
    PlannedMealController: Object.assign(PlannedMealController, PlannedMealController),
    ShoppingListController: Object.assign(ShoppingListController, ShoppingListController),
    WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
    WorkspaceInvitationController: Object.assign(WorkspaceInvitationController, WorkspaceInvitationController),
    Settings: Object.assign(Settings, Settings),
    Admin: Object.assign(Admin, Admin),
}

export default Controllers