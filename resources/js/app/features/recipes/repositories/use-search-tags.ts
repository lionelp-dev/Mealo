import { router } from '@inertiajs/react';
import { useState } from 'react';

type SearchTagsRequest = {
  tags_search: string;
};

export function useSearchTags() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchTags = (url: string, data: SearchTagsRequest) => {
    router.visit(url, {
      data,
      preserveUrl: false,
      preserveState: true,
      only: ['tags_search_results'],
      reset: ['tags_search_results'],
      replace: true,
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { searchTags, processing, errors };
}
