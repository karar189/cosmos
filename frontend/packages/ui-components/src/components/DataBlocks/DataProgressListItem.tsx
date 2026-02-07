/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion, Variants } from 'motion/react';
import { Tooltip } from '../Tooltip';
import * as styles from './DataProgressListItem.styles';
import { Tooltip as TooltipMui } from '@mui/material';

const MotionDiv = motion.div;
const MotionLi = motion.li;

export interface DataProgressListItemProps {
  label: string;
  value: number;
  maxValue?: number;
  tooltip?: string;
  suffix?: string;
  css?: Interpolation<Theme>;
  labelCss?: Interpolation<Theme>;
  valueCss?: Interpolation<Theme>;
  tooltipIconCss?: Interpolation<Theme>;
  progressFillCss?: Interpolation<Theme>;
  variants?: Variants;
}

/**
 * DataProgressListItem component - Displays a label, progress bar, and value
 */
export default function DataProgressListItem({
  label,
  value,
  maxValue = 100,
  suffix,
  tooltip,
  css: containerCss,
  labelCss,
  valueCss,
  tooltipIconCss,
  progressFillCss,
  variants,
}: DataProgressListItemProps) {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  return (
    <MotionLi css={[styles.dataProgressListItem, containerCss]} variants={variants}>
      <MotionDiv
        css={[styles.dataProgressListItemProgressFill, progressFillCss]}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      />
      <span css={styles.dataProgressListItemLabelContainer}>
        <TooltipMui title={label}>
          <span css={[styles.dataProgressListItemLabel, labelCss]}>{label}</span>
        </TooltipMui>
        {tooltip && (
          <Tooltip
            title={tooltip}
            tooltipIconCss={
              tooltipIconCss
                ? [styles.dataProgressListItemTooltipIcon, tooltipIconCss]
                : styles.dataProgressListItemTooltipIcon
            }
          />
        )}
      </span>
      <span css={[styles.dataProgressListItemValue, valueCss]}>
        {value}
        {suffix}
      </span>
    </MotionLi>
  );
}
