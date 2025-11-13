// Stub hooks for tags functionality
export const useTags = () => {
  return { data: [], isLoading: false };
};

export const useArticleTags = (articleId: string) => {
  return { data: [], isLoading: false };
};

export const useArticlesByTag = (tagSlug: string) => {
  return { data: [], isLoading: false };
};

export const useCreateTag = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useAddTagToArticle = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useRemoveTagFromArticle = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};
