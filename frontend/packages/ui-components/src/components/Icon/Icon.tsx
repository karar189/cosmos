/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React, { Suspense, SVGProps } from 'react';
import * as styles from './Icon.styles';
import { getIconComponent, IconName } from './iconRegistry';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Name of the icon from the icon registry
   */
  name: IconName;
  /**
   * CSS to apply to the icon
   */
  css?: Interpolation<Theme>;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, css, className, ...props }, ref) => {
    const IconComponent = React.useMemo(() => getIconComponent(name), [name]);

    // Extract ref from props to avoid type issues
    const { ...svgProps } = props;

    return (
      <Suspense
        fallback={
          <svg
            ref={ref}
            {...svgProps}
            css={[styles.icon, styles.iconPlaceholder, css]}
            className={className}
            aria-hidden="true"
          >
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        }
      >
        <IconComponent
          {...svgProps}
          ref={ref}
          className={className}
          css={css ? [styles.icon, css] : styles.icon}
        />
      </Suspense>
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
