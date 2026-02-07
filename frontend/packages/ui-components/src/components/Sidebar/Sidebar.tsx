/** @jsxImportSource @emotion/react */
'use client';

import { ReactNode } from 'react';
import * as styles from './Sidebar.styles';
import { Tooltip } from '../Tooltip';

export interface SidebarProps {
  /**
   * Title displayed in the sidebar header
   */
  title: string;
  /**
   * Content to display in the sidebar body
   */
  children: ReactNode;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Optional tooltip to display next to the title
   */
  tooltip?: string;
}

export default function Sidebar({ title, children, className, tooltip }: SidebarProps) {
  return (
    <aside css={styles.container} className={className}>
      <header css={styles.header}>
        <h2 css={styles.title}>{title}</h2>
        {tooltip && <Tooltip title={tooltip} />}
      </header>
      <div css={styles.content}>{children}</div>
    </aside>
  );
}
