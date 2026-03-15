import { useBetaRequestContext } from '../infrastructure/inertia.adapter';
import {
  handleApprove,
  handleCleanupAll,
  handleFilter,
  handleReject,
  handleResend,
  handleSearch,
} from '../infrastructure/repositories/beta-requests.repository';
import { StatusBadge } from './components/status-badge';
import { AppMainContent } from '@/app/components/app-main-content';
import {
  ConfirmDialog,
  useConfirmDialog,
} from '@/app/components/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Input } from '@/app/components/ui/input';
import AdminLayout from '@/app/layouts/admin-layout';
import { cn } from '@/app/lib/';
import { Head, router } from '@inertiajs/react';
import {
  Check,
  CheckCircle,
  Clock,
  Mail,
  MoreVertical,
  Search,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';

export default function BetaRequestsPage() {
  const { betaRequests, stats, filters } = useBetaRequestContext();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  const { confirm, dialogProps } = useConfirmDialog();

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
        { title: 'Beta Requests', href: '/admin/beta-requests' },
      ]}
    >
      <Head title="Gestion Beta - Admin" />

      <AppMainContent>
        <div className="grid gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestion Beta</h1>
              <p className="text-muted-foreground">
                Gérez les demandes d'accès beta et les comptes temporaires
              </p>
            </div>
            <button
              onClick={() => {
                confirm({
                  title: '⚠️ Supprimer tous les comptes beta',
                  message:
                    'Cette action supprimera TOUS les comptes beta (même non expirés) ainsi que toutes leurs données. Cette action est irréversible.',
                  submitBtnLabel: 'Supprimer tout',
                  onConfirm: () => {
                    handleCleanupAll();
                  },
                });
              }}
              className="btn gap-2 btn-error"
              disabled={stats.active_beta_users === 0}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer tous les beta users
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="stat-title">En attente</div>
                <div className="stat-value text-warning">{stats.pending}</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-success">
                  <Users className="h-8 w-8" />
                </div>
                <div className="stat-title">Actifs</div>
                <div className="stat-value text-success">
                  {stats.active_beta_users}
                </div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-info">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="stat-title">Convertis</div>
                <div className="stat-value text-info">{stats.converted}</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-base-content/50">
                  <XCircle className="h-8 w-8" />
                </div>
                <div className="stat-title">Total</div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-desc">
                  {stats.rejected} rejetés • {stats.expired} expirés
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par email..."
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    handleSearch({ query, selectedStatus });
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'pending', label: 'En attente' },
                { value: 'approved', label: 'Approuvés' },
                { value: 'converted', label: 'Convertis' },
                { value: 'rejected', label: 'Rejetés' },
                { value: 'expired', label: 'Expirés' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedStatus(status);
                    handleFilter({
                      searchQuery: searchQuery,
                      status: filter.value,
                    });
                  }}
                  className={cn(
                    'btn btn-sm',
                    selectedStatus === filter.value
                      ? 'btn-primary'
                      : 'btn-ghost',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-base-300/50">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Demandé le</th>
                  <th>Approuvé par</th>
                  <th>Expiration</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {betaRequests.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Aucune demande trouvée
                    </td>
                  </tr>
                ) : (
                  betaRequests.data.map((request) => (
                    <tr key={request.id} className="hover">
                      <td className="font-medium">{request.email}</td>
                      <td>
                        <StatusBadge status={request.status} />
                      </td>
                      <td>
                        {DateTime.fromISO(request.created_at).toRelative({
                          locale: 'fr',
                        })}
                      </td>
                      <td>
                        {request.approved_by?.name || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td>
                        {request.token_expires_at ? (
                          <span
                            className={cn(
                              'text-sm',
                              DateTime.fromISO(request.token_expires_at) <
                                DateTime.now()
                                ? 'text-error'
                                : 'text-muted-foreground',
                            )}
                          >
                            {DateTime.fromISO(
                              request.token_expires_at,
                            ).toRelative({
                              locale: 'fr',
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="btn btn-square btn-ghost btn-sm">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {request.status === 'pending' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    confirm({
                                      title: 'Approuver la demande',
                                      message: `Voulez-vous approuver la demande de ${request.email} ? Un email d'invitation sera envoyé.`,
                                      submitBtnLabel: 'Approuver',
                                      onConfirm: () => {
                                        handleApprove(request);
                                      },
                                    })
                                  }
                                  className="gap-2"
                                >
                                  <Check className="h-4 w-4" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    confirm({
                                      title: 'Rejeter la demande',
                                      message: `Voulez-vous rejeter la demande de ${request.email} ?`,
                                      submitBtnLabel: 'Rejeter',
                                      onConfirm: () => {
                                        handleReject(request);
                                      },
                                    })
                                  }
                                  className="gap-2 text-error"
                                >
                                  <X className="h-4 w-4" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  confirm({
                                    title: "Renvoyer l'invitation",
                                    message: `Voulez-vous renvoyer l'email d'invitation à ${request.email} ?`,
                                    submitBtnLabel: 'Renvoyer',
                                    onConfirm: () => {
                                      handleResend(request);
                                    },
                                  })
                                }
                                className="gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Renvoyer l'invitation
                              </DropdownMenuItem>
                            )}
                            {request.status === 'rejected' &&
                              request.rejection_reason && (
                                <div className="max-w-xs px-2 py-1.5 text-sm text-muted-foreground">
                                  Raison: {request.rejection_reason}
                                </div>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {betaRequests.meta.last_page > 1 && (
            <div className="flex justify-center">
              <div className="join">
                {betaRequests.meta.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={cn(
                      'btn join-item btn-sm',
                      link.active && 'btn-active',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </AppMainContent>

      {dialogProps && <ConfirmDialog {...dialogProps} />}
    </AdminLayout>
  );
}
