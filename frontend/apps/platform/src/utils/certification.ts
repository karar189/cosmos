/**
 * Certification level utilities
 */

/**
 * Get certification level for exchanges (high/medium/low)
 */
export function getExchangeCertificationLevel(level: string): number {
  switch (level.toLowerCase()) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

/**
 * Get certification level for projects (ISO 27001/SOC 2/Absent)
 */
export function getProjectCertificationLevel(level: string): number {
  switch (level.toLowerCase()) {
    case 'iso 27001':
      return 3;
    case 'soc 2':
      return 2;
    case 'absent':
      return 1;
    default:
      return 0;
  }
}

