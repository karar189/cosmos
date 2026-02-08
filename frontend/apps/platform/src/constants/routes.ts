/**
 * Centralized route definitions for the platform app
 * Use these constants instead of hardcoded strings for type safety and maintainability
 */

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/sign-up',
    RESET: '/auth/reset',
    VERIFY: '/auth/verify',
  },
  RATINGS: {
    PROJECTS: '/ratings/projects',
    EXCHANGES: '/ratings/exchanges',
    PROJECTS_SEARCH: (query: string) => `/ratings/projects?search=${encodeURIComponent(query)}`,
    EXCHANGES_SEARCH: (query: string) => `/ratings/exchanges?search=${encodeURIComponent(query)}`,
  },
  PROJECTS: {
    DETAILS: (id: string) => `/projects/${id}`,
  },
  EXCHANGES: {
    DETAILS: (id: string) => `/exchanges/${id}`,
  },
  WORKSPACE: {
    ROOT: '/workspace',
    PORTFOLIO: '/workspace/portfolio',
    ALERTS: '/workspace/alerts',
    CASES: '/workspace/cases',
    AGENTS: '/workspace/agents',
    WORKFLOWS: '/workspace/workflows',
    SETTINGS: '/workspace/settings',
    DOCS: '/workspace/docs',
    SUPPORT: '/workspace/support',
    // ArcX Features
    COMPLIANCE_MAKER: '/workspace/compliance-maker',
    AGENTIC_BUILDER: '/workspace/agentic-builder',
    ROUTING_ENGINE: '/workspace/routing-engine',
    DASHBOARD_BUILDER: '/workspace/dashboard-builder',
  },
  external: {
    methodology: 'https://docs.google.com/spreadsheets/d/1WBOJxJn3QAIgceR-vJtgFDO4A8kj4cj1uJZJaqw-qOY/edit?gid=0#gid=0',
    twitter: 'https://x.com/core3io',
  },
  HOME: '/',
} as const;

