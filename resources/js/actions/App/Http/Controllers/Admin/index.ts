import AdminController from './AdminController';
import BetaManagementController from './BetaManagementController';
import MailPreviewController from './MailPreviewController';

const Admin = {
  AdminController: Object.assign(AdminController, AdminController),
  BetaManagementController: Object.assign(
    BetaManagementController,
    BetaManagementController,
  ),
  MailPreviewController: Object.assign(
    MailPreviewController,
    MailPreviewController,
  ),
};

export default Admin;
