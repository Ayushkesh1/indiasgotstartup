// Stub hooks for series functionality
export const useUserSeries = (userId: string | undefined) => {
  return { data: [], isLoading: false };
};

export const useSeriesById = (seriesId: string) => {
  return { data: null, isLoading: false };
};

export const useCreateSeries = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useUpdateSeries = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useDeleteSeries = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useAddArticleToSeries = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useRemoveArticleFromSeries = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useUpdateSeriesOrder = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};
