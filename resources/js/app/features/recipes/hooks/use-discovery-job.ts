import {
  type DiscoveryJobStatus,
  fetchDiscoveryJobStatus,
} from '../repositories/recipe-discovery.api';
import { useEffect, useRef } from 'react';

const POLLING_INTERVAL_MS = 1500;

type Callbacks = {
  onStatus: (status: DiscoveryJobStatus) => void;
  onError: () => void;
};

export function useDiscoveryJob(jobId: string | null, callbacks: Callbacks) {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!jobId) return;
    const controller = new AbortController();
    let nextPoll: number | undefined;

    const poll = async () => {
      try {
        const status = await fetchDiscoveryJobStatus(jobId, controller.signal);
        if (controller.signal.aborted) return;
        callbacksRef.current.onStatus(status);
        if (status.status === 'queued' || status.status === 'processing') {
          nextPoll = window.setTimeout(poll, POLLING_INTERVAL_MS);
        }
      } catch {
        if (!controller.signal.aborted) callbacksRef.current.onError();
      }
    };

    void poll();
    return () => {
      controller.abort();
      if (nextPoll !== undefined) window.clearTimeout(nextPoll);
    };
  }, [jobId]);
}
