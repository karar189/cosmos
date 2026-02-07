/** @jsxImportSource @emotion/react */
'use client';
import { Icon, Tooltip } from '@core3/ui-components';
import * as styles from './ExampleLabel.styles';

interface ExampleLabelProps {
  bordered?: boolean;
  label: string;
  tooltip: string;
  tooltipTitle?: string;
}
const ExampleLabel: React.FC<ExampleLabelProps> = ({ bordered = false, label, tooltip, tooltipTitle }) => {
  return (
    <Tooltip title={tooltip} tooltipTitle={tooltipTitle}>
      <div css={styles.container({ bordered })}>
        <Icon name="warning-triangle" css={styles.icon} />
        <span>{label}</span>
      </div>
    </Tooltip>
  );
};

export default ExampleLabel;
