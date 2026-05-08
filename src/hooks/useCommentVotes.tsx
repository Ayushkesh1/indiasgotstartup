// Stub hooks for comment voting functionality
export const useCommentVoteCount = (commentId: string) => {
  return { data: 0, isLoading: false };
};

export const useUserCommentVote = (commentId: string, userId: string | undefined) => {
  return { data: null, isLoading: false };
};

export const useToggleCommentVote = () => {
  return {
    mutate: (params: { commentId: string; userId: string; hasVoted: boolean }) => {},
    isPending: false
  };
};
