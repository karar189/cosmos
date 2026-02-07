/** @jsxImportSource @emotion/react */
'use client';

import { Badge, DataListItemImage } from '@core3/ui-components';

import { Reputational } from '@/types/api/project';
import { getBadgeColorByLevel } from '@/utils/badge';
import * as styles from './ProjectReputation.styles';

export interface ProjectReputationProps {
  project?: NonNullable<Reputational['auditReputation']>['topAuditor'];
}

const ProjectReputation: React.FC<ProjectReputationProps> = ({ project }) => {
  if (!project) {
    return null;
  }
  return (
    <div css={styles.projectReputation}>
      <div css={styles.projectReputationLogo}>
        {project.logo && <DataListItemImage src={project.logo} alt={project.name} />}
      </div>
      <span css={styles.projectReputationName}>{project.name}</span>
      <Badge color={getBadgeColorByLevel(project.grade.label)}>{project.grade.tier}</Badge>
    </div>
  );
};

export default ProjectReputation;
