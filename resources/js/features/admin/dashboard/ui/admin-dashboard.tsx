import { useAdminDashboardContext } from '../infrastructure/inertia.adapter';
import { AppMainContent } from '@/components/app-main-content';
import AdminLayout from '@/layouts/admin-layout';
import { index as betaRequestsIndex } from '@/routes/admin/beta';
import { Head, Link } from '@inertiajs/react';
import {
  Clock,
  CookingPot,
  FolderKanban,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

export default function AdminDashboard() {
  const { stats } = useAdminDashboardContext();
  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <AppMainContent>
        <div className="grid gap-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of platform metrics and activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">
                  {stats.total_users}
                </div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-success">
                  <UserCheck className="h-8 w-8" />
                </div>
                <div className="stat-title">Beta Users</div>
                <div className="stat-value text-success">
                  {stats.beta_users}
                </div>
              </div>
            </div>

            <Link
              href={betaRequestsIndex().url}
              className="stats shadow transition-shadow hover:shadow-lg"
            >
              <div className="stat">
                <div className="stat-figure text-warning">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="stat-title">Pending Beta Requests</div>
                <div className="stat-value text-warning">
                  {stats.pending_beta_requests}
                </div>
                <div className="stat-desc">Click to manage</div>
              </div>
            </Link>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-info">
                  <CookingPot className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Recipes</div>
                <div className="stat-value text-info">
                  {stats.total_recipes}
                </div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FolderKanban className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Workspaces</div>
                <div className="stat-value text-secondary">
                  {stats.total_workspaces}
                </div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-accent">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="stat-title">New Signups (7 days)</div>
                <div className="stat-value text-accent">
                  {stats.recent_signups_week}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppMainContent>
    </AdminLayout>
  );
}
