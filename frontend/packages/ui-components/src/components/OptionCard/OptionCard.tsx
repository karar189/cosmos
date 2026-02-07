/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
// import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import * as styles from './OptionCard.styles';


export interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionType?: 'arrow' | 'radio';
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
}

export default function OptionCard({
  icon,
  title,
  description,
  actionType = 'arrow',
  selected = false,
  onClick,
  disabled = false,
  id,
}: OptionCardProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      id={id}
      css={styles.container(disabled, selected)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={actionType === 'radio' ? selected : undefined}
    >
      <div css={styles.iconContainer}>{icon}</div>
      
      <div css={styles.contentContainer}>
        <div css={styles.title}>{title}</div>
        <div css={styles.description}>{description}</div>
      </div>

      <div css={actionType === 'arrow' ? styles.actionContainer : styles.radioContainer}>
        {actionType === 'arrow' ? (
            <div css={styles.arrowButton(disabled)}>
            <Icon name="chevron-right" />
            </div>
        ) : (
            <Radio
                checked={selected}
                disabled={disabled}
                size="md"
                onChange={onClick ? () => onClick() : undefined}
            />
            )}
        </div>
    </div>
  );
}