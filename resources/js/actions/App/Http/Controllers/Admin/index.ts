import AdminController from './AdminController'
import UserManagementController from './UserManagementController'
import DemoInviteController from './DemoInviteController'
import MailPreviewController from './MailPreviewController'

const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
    DemoInviteController: Object.assign(DemoInviteController, DemoInviteController),
    MailPreviewController: Object.assign(MailPreviewController, MailPreviewController),
}

export default Admin