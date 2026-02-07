/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { Icon, IconName } from '../Icon';
import { Tooltip } from '../Tooltip';
import * as styles from './CardHeader.styles';

/**
 * CardHeader component - Header for cards with icon, title, and tooltip
 */
export interface CardHeaderProps {
  icon?: IconName;
  title: string;
  tooltip?: string;
  tooltipIcon?: IconName;
  css?: Interpolation<Theme>;
  titleCss?: Interpolation<Theme>;
  iconCss?: Interpolation<Theme>;
  tooltipIconCss?: Interpolation<Theme>;
  titleType?: 'primary' | 'secondary';
  rightContent?: React.ReactNode;
  rightContentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'css'> & { css?: Interpolation<Theme> };
}

export default function CardHeader({
  icon,
  title,
  tooltip,
  tooltipIcon,
  titleCss,
  iconCss,
  tooltipIconCss,
  titleType = 'primary',
  rightContent,
  rightContentProps,
  ...props
}: CardHeaderProps) {
  return (
    <div css={styles.cardHeader} {...props}>
      {icon && <Icon name={icon} css={[styles.cardHeaderIcon, iconCss]} />}
      <h3 css={[styles.cardHeaderTitle(titleType), titleCss]}>{title}</h3>
      {tooltip && <Tooltip title={tooltip} icon={tooltipIcon} tooltipIconCss={tooltipIconCss} />}
      {rightContent && <div css={styles.cardHeaderRightContent} {...rightContentProps}>{rightContent}</div>}
    </div>
  );
}
