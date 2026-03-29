import { BetaRequest } from '@/types';
import { approve, cleanupAll, reject, resend } from '@/routes/admin/beta';
import { router } from '@inertiajs/react';

export const handleFilter = ({
  searchQuery,
  status,
}: {
  searchQuery: string;
  status: string;
}) =>
  router.get(
    '/admin/beta-requests',
    {
      status: status === 'all' ? undefined : status,
      search: searchQuery || undefined,
    },
    { preserveState: true },
  );

export const handleSearch = ({
  query,
  selectedStatus,
}: {
  query: string;
  selectedStatus: string;
}) =>
  router.get(
    '/admin/beta-requests',
    {
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      search: query || undefined,
    },
    { preserveState: true, preserveScroll: true },
  );

export const handleApprove = (betaRequest: BetaRequest) =>
  router.post(approve({ betaRequest: betaRequest.id }).url);

export const handleReject = (betaRequest: BetaRequest) =>
  router.post(reject({ betaRequest: betaRequest.id }).url, {
    rejection_reason: "Demande rejetée par l'administrateur",
  });

export const handleResend = (betaRequest: BetaRequest) =>
  router.post(resend({ betaRequest: betaRequest.id }).url);

export const handleCleanupAll = () => router.post(cleanupAll().url);
