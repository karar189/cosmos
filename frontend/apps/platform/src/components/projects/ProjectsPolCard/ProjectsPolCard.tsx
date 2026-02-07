/** @jsxImportSource @emotion/react */
'use client';

import { Card, DataList, DataListItemData, Icon, IconName } from '@core3/ui-components';
import { useCallback, useMemo } from 'react';
import * as styles from './ProjectsPolCard.styles';
import BadgeRankScore from '@/components/common/BadgeRankScore/BadgeRankScore';
import { ROUTES } from '@/constants/routes';
interface Project {
  id: string;
  name: string;
  logo: string;
}

interface ProbabilityOfLoss {
  score: number;
  grade: string;
  delta: number;
}

interface ProjectsPolCardData {
  project: Project;
  probabilityOfLoss: ProbabilityOfLoss;
}

export interface ProjectsPolCardProps {
  title: string;
  icon: IconName;
  data?: ProjectsPolCardData[];
}

/**
 * Temporary ProjectsPolCard component
 * Contains Card with DataList and InfoList components
 */
export default function ProjectsPolCard({ title, icon, data }: ProjectsPolCardProps) {
  const renderValueBlock = useCallback((probabilityOfLoss: ProbabilityOfLoss) => {
    const isPositive = probabilityOfLoss.delta > 0;
    return (
      <div css={styles.valueBlock}>
        <BadgeRankScore score={probabilityOfLoss.score} level={probabilityOfLoss.grade} isPol />
        <div css={styles.deltaBlock}>
          <Icon name="delta" css={styles.deltaIcon(isPositive)} />
          <span css={styles.deltaValue}>
            {isPositive ? '+' : ''}
            {probabilityOfLoss.delta}
          </span>
        </div>
      </div>
    );
  }, []);
  const dataList = useMemo<DataListItemData[]>(() => {
    return (
      data?.map((item) => ({
        label: item.project.name,
        value: renderValueBlock(item.probabilityOfLoss),
        logoUrl: item.project.logo,
        href: ROUTES.PROJECTS.DETAILS(item.project.id),
      })) ?? []
    );
  }, [data, renderValueBlock]);
  return (
    <Card title={title} icon={icon} titleType="secondary">
      <DataList items={dataList} contentAlign="right" />
    </Card>
  );
}
