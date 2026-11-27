import AdminController from './AdminController';
import DemoInviteController from './DemoInviteController';
import MailPreviewController from './MailPreviewController';
import UserManagementController from './UserManagementController';

const Admin = {
  AdminController: Object.assign(AdminController, AdminController),
  UserManagementController: Object.assign(
    UserManagementController,
    UserManagementController,
  ),
  DemoInviteController: Object.assign(
    DemoInviteController,
    DemoInviteController,
  ),
  MailPreviewController: Object.assign(
    MailPreviewController,
    MailPreviewController,
  ),
};

export default Admin;
