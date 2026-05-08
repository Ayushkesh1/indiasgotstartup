// Stub hooks for reading progress functionality
export const useReadingProgress = (articleId: string, userId: string | undefined) => {
  return { data: null, isLoading: false };
};

export const useTrackReadingProgress = (articleId: string, userId: string | undefined, enabled: boolean) => {
  // Stub - do nothing for now
  return;
};
