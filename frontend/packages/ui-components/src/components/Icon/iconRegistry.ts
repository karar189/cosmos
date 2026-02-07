/**
 * Icon Registry
 *
 * Maps icon names to their lazy-loaded components.
 * Icons are lazy loaded for optimal performance.
 */

import { lazy, ComponentType, SVGProps } from 'react';
export type IconName =
  | 'info'
  | 'checkmark'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'arrow-up'
  | 'arrow-down'
  | 'star'
  | 'activity'
  | 'arrow-down-right'
  | 'arrow-up-right'
  | 'bank'
  | 'chat'
  | 'check-circle'
  | 'check-stamp'
  | 'close'
  | 'data-flow'
  | 'data-stack'
  | 'data-transfer'
  | 'dollar-circle'
  | 'eye-closed'
  | 'eye-open'
  | 'filter'
  | 'menu'
  | 'minus-circle'
  | 'plus-circle'
  | 'search'
  | 'search-success'
  | 'security'
  | 'sorting'
  | 'stat-down'
  | 'stat-up'
  | 'tools'
  | 'warning-hexagon'
  | 'warning-triangle'
  | 'twitter'
  | 'discord'
  | 'telegram'
  | 'github'
  | 'medium'
  | 'youtube'
  | 'linkedin'
  | 'no-results'
  | 'delta'
  | 'emoji-smile'
  | 'emoji-sad'
  | 'negative-circle'
  | 'arrow-enter'
  | 'negative-circle'
  | 'check'
  | 'google'
  | 'apple'
  | 'organization'
  | 'individual'
  | 'project'
  | 'candle-stick'
  | 'piggy-bank'
  | 'researcher'
  | 'lock'
  | 'settings'
  | 'documentation'
  | 'support'
  | 'clock'
  | 'copy';

type SVGComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Lazy load icon components
const iconComponents: Record<IconName, () => Promise<{ default: SVGComponent }>> = {
  lock: () => import('./icons/LockIcon'),
  settings: () => import('./icons/settings'),
  documentation: () => import('./icons/document'),
  support: () => import('./icons/SupportIcon'),
  clock: () => import('./icons/clock'),
  info: () => import('./icons/InfoIcon'),
  checkmark: () => import('./icons/CheckmarkIcon'),
  'chevron-left': () => import('./icons/ChevronLeftIcon'),
  'chevron-right': () => import('./icons/ChevronRightIcon'),
  'chevron-down': () => import('./icons/ChevronDownIcon'),
  'chevron-up': () => import('./icons/ChevronUpIcon'),
  'arrow-up': () => import('./icons/ArrowUpIcon'),
  'arrow-down': () => import('./icons/ArrowDownIcon'),
  star: () => import('./icons/StarIcon'),
  twitter: () => import('./icons/TwitterIcon'),
  discord: () => import('./icons/DiscordIcon'),
  telegram: () => import('./icons/TelegramIcon'),
  github: () => import('./icons/GithubIcon'),
  medium: () => import('./icons/MediumIcon'),
  youtube: () => import('./icons/YoutubeIcon'),
  linkedin: () => import('./icons/LinkedinIcon'),
  'stat-up': () => import('./icons/StatUpIcon'),
  'stat-down': () => import('./icons/StatDownIcon'),
  activity: () => import('./icons/ActivityIcon'),
  'arrow-down-right': () => import('./icons/ArrowDownRightIcon'),
  'arrow-up-right': () => import('./icons/ArrowUpRightIcon'),
  bank: () => import('./icons/BankIcon'),
  chat: () => import('./icons/ChatIcon'),
  'check-circle': () => import('./icons/CheckCircleIcon'),
  'check-stamp': () => import('./icons/CheckStampIcon'),
  close: () => import('./icons/CloseIcon'),
  'data-flow': () => import('./icons/DataFlowIcon'),
  'data-stack': () => import('./icons/DataStackIcon'),
  'data-transfer': () => import('./icons/DataTransferIcon'),
  'dollar-circle': () => import('./icons/DollarCircleIcon'),
  'eye-closed': () => import('./icons/EyeClose'),
  'eye-open': () => import('./icons/EyeOpen'),
  filter: () => import('./icons/FilterIcon'),
  menu: () => import('./icons/MenuIcon'),
  'minus-circle': () => import('./icons/MinusCircleIcon'),
  'plus-circle': () => import('./icons/PlusCircleIcon'),
  search: () => import('./icons/SearchIcon'),
  'search-success': () => import('./icons/SearchSuccessIcon'),
  security: () => import('./icons/SecurityIcon'),
  sorting: () => import('./icons/SortingIcon'),
  tools: () => import('./icons/ToolsIcon'),
  'warning-hexagon': () => import('./icons/WarningHexagonIcon'),
  'warning-triangle': () => import('./icons/WarningTriangleIcon'),
  'no-results': () => import('./icons/NoResultsIcon'),
  delta: () => import('./icons/DeltaIcon'),
  'arrow-enter': () => import('./icons/ArrowEnterIcon'),
  'negative-circle': () => import('./icons/NegativeCircleIcon'),
  check: () => import('./icons/CheckIcon'),
  google: () => import('./icons/Google'),
  apple: () => import('./icons/Apple'),
  organization: () => import('./icons/Organization'),
  individual: () => import('./icons/Individual'),
  project: () => import('./icons/Project'),
  'candle-stick': () => import('./icons/CandleStick'),
  'piggy-bank': () => import('./icons/PiggyBank'),
  researcher: () => import('./icons/Researcher'),
  'emoji-smile': () => import('./icons/EmojiSmileIcon'),
  'emoji-sad': () => import('./icons/EmojiSadIcon'),
  copy: () => import('./icons/CopyIcon'),
};

/**
 * Get the lazy component for an icon by name
 */
export function getIconComponent(name: IconName) {
  return lazy(iconComponents[name]);
}

/**
 * Check if an icon name exists in the registry
 */
export function isValidIconName(name: string): name is IconName {
  return name in iconComponents;
}

/**
 * Get all available icon names
 */
export function getAvailableIconNames(): IconName[] {
  return Object.keys(iconComponents) as IconName[];
}
