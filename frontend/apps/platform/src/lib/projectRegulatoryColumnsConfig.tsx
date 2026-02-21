/** @jsxImportSource @emotion/react */
import type { ColumnConfig } from '@core3/ui-components';
import type { SerializedStyles } from '@emotion/react';
import Image from 'next/image';
import { ProjectListItem } from '@/types/api/projectsStatistic';
import { Badge } from '@core3/ui-components';

interface ProjectStyles {
  clickableProject: SerializedStyles;
  projectLogo: SerializedStyles;
  projectInfo: SerializedStyles;
  projectName: SerializedStyles;
  projectChain: SerializedStyles;
}

interface ColumnsConfigOptions {
  t: (key: string, defaultValue: string) => string;
  onProjectClick: (projectId: string) => void;
  styles: ProjectStyles;
}

// Extended type for regulatory data (mock/placeholder until API provides it)
interface RegulatoryReadinessData {
  jurisdiction?: string;
  assetType?: string;
  registrationStatus?: string;
  requiredCertifications?: string[];
  complianceModulesEnabled?: string[];
  missingSteps?: string[];
  routingCorridorUsed?: string;
}

// Helper to get regulatory data (mock for now - replace with actual API data)
function getRegulatoryData(item: ProjectListItem): RegulatoryReadinessData {
  // Mock data - replace with actual API data when available
  const mockData: Record<string, RegulatoryReadinessData> = {
    // Example: map project IDs to regulatory data
  };
  
  return mockData[item.project.id] || {
    jurisdiction: 'UAE',
    assetType: item.project.category || 'Token',
    registrationStatus: 'In Progress',
    requiredCertifications: ['KYC Policy'],
    complianceModulesEnabled: ['Soroban'],
    missingSteps: ['Audit Cert'],
    routingCorridorUsed: 'Enabled',
  };
}

export function createProjectRegulatoryColumnsConfig({
  t,
  onProjectClick,
  styles,
}: ColumnsConfigOptions): ColumnConfig<ProjectListItem>[] {
  return [
    {
      key: 'project',
      name: t('regulatory.table.columns.project', 'Project / Asset'),
      type: 'custom',
      render: (_value, row) => (
        <div
          css={styles.clickableProject}
          onClick={() => onProjectClick(row.project.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onProjectClick(row.project.id);
            }
          }}
        >
          <div css={styles.projectLogo}>
            <Image src={row.project.logo} alt={row.project.name} fill />
          </div>
          <div css={styles.projectInfo}>
            <span css={styles.projectName}>{row.project.name}</span>
            <span css={styles.projectChain}>{row.project.ticker}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'jurisdiction',
      name: t('regulatory.table.columns.jurisdiction', 'Jurisdiction'),
      type: 'text',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        return regData.jurisdiction || 'N/A';
      },
      enableSorting: false,
    },
    {
      key: 'assetType',
      name: t('regulatory.table.columns.assetType', 'Asset Type'),
      type: 'text',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        return regData.assetType || row.project.category || 'N/A';
      },
      enableSorting: false,
    },
    {
      key: 'registrationStatus',
      name: t('regulatory.table.columns.registrationStatus', 'Registration Status'),
      type: 'custom',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        const status = regData.registrationStatus || 'N/A';
        const statusColor = status === 'Registered' ? 'green' : status === 'In Progress' ? 'yellow' : 'gray';
        return (
          <Badge color={statusColor}>{status}</Badge>
        );
      },
      enableSorting: false,
    },
    {
      key: 'requiredCertifications',
      name: t('regulatory.table.columns.requiredCertifications', 'Required Certifications'),
      type: 'custom',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        const certs = regData.requiredCertifications || [];
        return certs.length > 0 ? certs.join(', ') : 'N/A';
      },
      enableSorting: false,
    },
    {
      key: 'complianceModulesEnabled',
      name: t('regulatory.table.columns.complianceModulesEnabled', 'Compliance Modules Enabled'),
      type: 'custom',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        const modules = regData.complianceModulesEnabled || [];
        return modules.length > 0 ? modules.join(', ') : 'None';
      },
      enableSorting: false,
    },
    {
      key: 'missingSteps',
      name: t('regulatory.table.columns.missingSteps', 'Missing Steps'),
      type: 'custom',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        const missing = regData.missingSteps || [];
        return missing.length > 0 ? (
          <span style={{ color: '#ef4444' }}>{missing.join(', ')}</span>
        ) : (
          <span style={{ color: '#22c55e' }}>None</span>
        );
      },
      enableSorting: false,
    },
    {
      key: 'routingCorridorUsed',
      name: t('regulatory.table.columns.routingCorridorUsed', 'Routing Corridor Used'),
      type: 'custom',
      render: (_value, row) => {
        const regData = getRegulatoryData(row);
        const corridor = regData.routingCorridorUsed || 'N/A';
        return corridor === 'Enabled' ? (
          <Badge color="green">{corridor}</Badge>
        ) : (
          <span>{corridor}</span>
        );
      },
      enableSorting: false,
    },
  ];
}
