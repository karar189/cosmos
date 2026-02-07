/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React from 'react';
import { IconName } from '../Icon';
import { Tooltip } from '../Tooltip';
import * as styles from './DataValue.styles';

export type SubvalueType = {
  value: string;
  positive?: boolean;
  negative?: boolean;
  type?: 'primary' | 'secondary';
  css?: Interpolation<Theme>;
};

export interface DataValueProps {
  label: string;
  value: string | React.ReactNode;
  subvalue?: SubvalueType | SubvalueType[];
  tooltip?: string;
  tooltipIcon?: IconName;
  css?: Interpolation<Theme>;
  labelCss?: Interpolation<Theme>;
  valueCss?: Interpolation<Theme>;
  tooltipIconCss?: Interpolation<Theme>;
  subvalueContainerCss?: Interpolation<Theme>;
  disabled?: boolean;
}

/**
 * DataValue component - Displays a label, value, and optional subvalue with color coding for positive/negative states
 */
export default function DataValue({
  label,
  value,
  subvalue,
  tooltip,
  css,
  labelCss,
  valueCss,
  tooltipIconCss,
  subvalueContainerCss,
  disabled,
}: DataValueProps) {
  const renderSubvalue = ({ value, type, positive, negative, ...rest }: SubvalueType) => {
    return (
      <span
        css={styles.dataValueSubvalue({
          type: type || 'primary',
          positive: positive || false,
          negative: negative || false,
        })}
        {...rest}
      >
        {value}
      </span>
    );
  };
  return (
    <div css={[styles.dataValue, css]}>
      <div css={styles.dataValueLabelContainer}>
        <span css={[styles.dataValueLabel, labelCss]}>{label}</span>
        {tooltip && (
          <Tooltip
            title={tooltip}
            tooltipIconCss={
              tooltipIconCss
                ? [styles.dataValueTooltipIcon, tooltipIconCss]
                : styles.dataValueTooltipIcon
            }
          />
        )}
      </div>
      <div css={styles.dataValueContent}>
        <span css={[styles.dataValueValue({ disabled }), valueCss]}>{value}</span>
        {subvalue &&
          (subvalue instanceof Array ? (
            <div css={[styles.dataValueSubvalues, subvalueContainerCss]}>
              {subvalue.map((subvalue, index) => (
                <React.Fragment key={index}>{renderSubvalue(subvalue)}</React.Fragment>
              ))}
            </div>
          ) : (
            renderSubvalue(subvalue)
          ))}
      </div>
    </div>
  );
}
