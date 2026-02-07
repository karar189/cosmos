/** @jsxImportSource @emotion/react */

import { motion } from "motion/react";
import { IconTextCell, IdCell } from "@core3/ui-components";
import * as styles from "./ResultsTable.styles";
import type { ProjectData, ExchangeData } from "../../types";
import { BadgeRankScore } from "@/components/common/BadgeRankScore";

interface SearchResultRowProps {
  item: ProjectData | ExchangeData;
  type: 'project' | 'exchange';
  onClick: () => void;
  isSelected?: boolean;
  index?: number;
}

const MotionTr = motion.tr;

export function SearchResultRow({ item, type, onClick, isSelected = false, index = 0 }: SearchResultRowProps) {
  const name = type === 'project' 
    ? (item as ProjectData).project 
    : (item as ExchangeData).name;
  const secondary = type === 'project' ? (item as ProjectData).chain : undefined;
  const logo = item.logo;
  
  // Projects have pol, exchanges have security
  const score = type === 'project' 
    ? (item as ProjectData).pol.score 
    : (item as ExchangeData).security.score;
  const grade = type === 'project' 
    ? (item as ProjectData).pol.grade 
    : (item as ExchangeData).security.grade;
  const scoreLabel = type === 'project' ? 'PoL' : 'Security';

  return (
    <MotionTr
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      layout="position"
      css={[styles.resultRow, isSelected && styles.resultRowSelected]} 
      onClick={onClick}
      tabIndex={0}
      role="button"
      data-navigable="true"
      aria-label={`${name}${secondary ? `, ${secondary}` : ''}, ${scoreLabel} score ${score}, grade ${grade}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <td css={styles.projectCell}>
        <IconTextCell 
          primary={name}
          secondary={secondary}
          icon={logo}
          iconAlt={name}
          iconSize="md"
        />
      </td>
      <td css={[styles.polCell, type === 'project' && styles.polCellProject]}>
        <BadgeRankScore 
          score={score} 
          level={grade} 
          isPol={type === 'project'}
          isSecurityScore={type === 'exchange'}
        />
      </td>
      <td css={styles.idCell}>
        <IdCell value={type === 'exchange' ? `#${(item as ExchangeData).rank || item.id}` : `#${item.id}`} />
      </td>
    </MotionTr>
  );
}

