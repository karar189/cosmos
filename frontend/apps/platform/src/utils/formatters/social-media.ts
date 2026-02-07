/**
 * Maps social media URLs to platform names
 */
export const getSocialPlatformName = (url: string): string => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'Twitter';
  if (lowerUrl.includes('discord')) return 'Discord';
  if (lowerUrl.includes('telegram') || lowerUrl.includes('t.me')) return 'Telegram';
  if (lowerUrl.includes('github')) return 'GitHub';
  if (lowerUrl.includes('medium')) return 'Medium';
  if (lowerUrl.includes('reddit')) return 'Reddit';
  if (lowerUrl.includes('youtube')) return 'YouTube';
  if (lowerUrl.includes('linkedin')) return 'LinkedIn';
  if (lowerUrl.includes('facebook')) return 'Facebook';
  return 'Website';
};