/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion, Variants } from 'motion/react';
import React from 'react';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import * as styles from './DataListItem.styles';
import Image from 'next/image';
import Link from 'next/link';

export interface DataListItemProps {
  label?: string;
  value?: string | React.ReactNode;
  logoUrl?: string | null;
  checked?: boolean; // Only used when itemType is 'check'
  negative?: boolean;
  positive?: boolean; // Only used when itemType is 'check'
  tooltip?: string;
  blurred?: boolean; // When true, blurs the value
  css?: Interpolation<Theme>;
  labelCss?: Interpolation<Theme>;
  valueCss?: Interpolation<Theme>;
  tooltipIconCss?: Interpolation<Theme>;
  checkmarkIconCss?: Interpolation<Theme>;
  contentAlign?: 'left' | 'right'; // Only used when itemType is 'check'
  variants?: Variants;
  checkPosition?: 'left' | 'right';
  valueWeight?: 'normal' | 'medium' | 'bold';
  bulletPoint?: boolean;
  href?: string;
}

/**
 * DataListItem component - Displays a label-value pair with optional checkmark and tooltip
 * Supports both 'info' and 'check' item types
 */
const MotionLi = motion.li;
const MotionLink = motion(Link);

export default function DataListItem({
  label,
  value,
  checked,
  negative,
  positive,
  tooltip,
  blurred,
  css,
  labelCss,
  valueCss,
  tooltipIconCss,
  checkmarkIconCss,
  contentAlign,
  logoUrl,
  variants,
  checkPosition = 'left',
  valueWeight = 'medium',
  bulletPoint = false,
  href,
}: DataListItemProps) {
  const MotionComponent = href ? MotionLink : MotionLi;
  const renderCheckmark = () => {
    if (checked) {
      return <Icon name="check-circle" css={[styles.dataListItemCheckmark, checkmarkIconCss]} />;
    } else if (negative) {
      return (
        <Icon
          name="negative-circle"
          css={[styles.dataListItemCheckmark, styles.negativeCircleIcon, checkmarkIconCss]}
        />
      );
    } else if (positive) {
      return (
        <Icon
          name="plus-circle"
          css={[styles.dataListItemCheckmark, styles.positiveCircleIcon, checkmarkIconCss]}
        />
      );
    }
    return null;
  };

  return (
    <MotionComponent href={href} css={[styles.dataListItem, css]} variants={variants}>
      {bulletPoint && <span css={styles.bulletPoint}>•</span>}
      {logoUrl ? (
        <div css={styles.dataListItemLogo}>
          <Image src={logoUrl} alt={label ?? ''} fill />
        </div>
      ) : logoUrl === null ? (
        <div css={styles.dataListItemLogoFallback} />
      ) : null}
      {checkPosition === 'left' && renderCheckmark()}
      <span css={styles.dataListItemContent}>
        <span css={styles.dataListItemLabelContainer}>
          {label && <span css={[styles.dataListItemLabel, labelCss]}>{label}</span>}
          {tooltip && (
            <Tooltip
              title={tooltip}
              tooltipIconCss={
                tooltipIconCss
                  ? [styles.dataListItemTooltipIcon, tooltipIconCss]
                  : styles.dataListItemTooltipIcon
              }
            />
          )}
        </span>
        {checkPosition === 'right' && (
          <span css={styles.dataListItemCheckContainer}>{renderCheckmark()}</span>
        )}
        <span
          css={[
            styles.dataListItemValue({ contentAlign, checkPosition, valueWeight }),
            blurred && styles.dataListItemValueBlurred,
            valueCss,
          ]}
        >
          {value}
        </span>
      </span>
    </MotionComponent>
  );
}
