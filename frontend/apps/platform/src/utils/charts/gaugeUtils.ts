export const getTwitterScoreByStatus = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'excellent':
      return 100;
    case 'good':
      return 75;
    case 'average':
      return 50;
    case 'poor':
      return 25;
    default:
      return 0;
  }
};
