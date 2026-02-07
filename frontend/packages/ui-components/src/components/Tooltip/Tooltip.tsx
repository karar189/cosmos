/** @jsxImportSource @emotion/react */
'use client';
import { Interpolation, Theme } from '@emotion/react';
import TooltipMui, { TooltipProps as TooltipPropsMui } from '@mui/material/Tooltip';
import { forwardRef, isValidElement, ReactNode } from 'react';
import { IconName } from '../Icon';
import TooltipIcon from './TooltipIcon';
import * as styles from './Tooltip.styles';

export interface TooltipProps extends Omit<TooltipPropsMui, 'children' | 'title'> {
  icon?: IconName;
  children?: ReactNode;
  tooltipIconCss?: Interpolation<Theme>;
  /** The main content of the tooltip */
  title: ReactNode;
  /** Optional title/heading displayed above the tooltip content */
  tooltipTitle?: ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, icon, tooltipIconCss, title, tooltipTitle }, ref) => {
    const childElement = children || <TooltipIcon icon={icon || 'info'} css={tooltipIconCss} />;
    const wrappedChild = isValidElement(childElement) ? childElement : <span>{childElement}</span>;

    const tooltipContent = tooltipTitle ? (
      <div css={styles.tooltipContent}>
        <span css={styles.tooltipTitle}>{tooltipTitle}</span>
        <span>{title}</span>
      </div>
    ) : (
      title
    );

    return (
      <TooltipMui 
        ref={ref} 
        title={tooltipContent}
        disableTouchListener={false}
        enterTouchDelay={0}
        leaveTouchDelay={1500}
      >
        <div>{wrappedChild}</div>
      </TooltipMui>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
