/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import * as styles from './Badge.styles';

export type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'gray' | 'default' | 'white';
export type BadgeSize = 'small' | 'medium' | 'large';

export type BadgeProps = {
  onClick?: () => void;
  color?: BadgeColor;
  size?: BadgeSize;
  mono?: boolean;
  children?: React.ReactNode;
  css?: Interpolation<Theme>;
  href?: LinkProps['href'];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  weight?: 'normal' | 'medium' | 'bold' /**
   * Icon component to display (e.g., social media icons)
   */;
  iconComponent?: React.ReactNode;
  /**
   * Image URL for the icon (from server)
   */
  iconSrc?: string | null;

  iconPosition?: 'left' | 'right';
};

export default function Badge({
  onClick,
  color = 'default',
  size = 'medium',
  mono = false,
  children,
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  weight = 'medium',
  iconComponent,
  iconSrc,
  iconPosition = 'left',
  ...props
}: BadgeProps) {
  const icon = iconComponent ? (
    <div css={styles.iconWrapper}>{iconComponent}</div>
  ) : iconSrc ? (
    <div css={styles.iconImage}>
      <Image src={iconSrc} alt={typeof children === 'string' ? children : ''} fill />
    </div>
  ) : null;
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        css={styles.getBadgeContainerStyles({ color, size, mono, weight })}
        onClick={onClick}
        {...props}
      >
        {iconPosition === 'left' && icon}
        <span css={styles.badgeContent}>{children}</span>
        {iconPosition === 'right' && icon}
      </Link>
    );
  }
  return (
    <div
      css={styles.getBadgeContainerStyles({ color, size, mono, weight })}
      onClick={onClick}
      {...props}
    >
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </div>
  );
}
