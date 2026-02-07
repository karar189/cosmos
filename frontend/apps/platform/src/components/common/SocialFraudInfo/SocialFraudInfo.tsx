/** @jsxImportSource @emotion/react */
'use client';

import { Reputational } from '@/types/api/project';
import { formatAmount } from '@/utils/format';
import { Badge, DataText } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import * as styles from './SocialFraudInfo.styles';
import { getColorBySeverity } from '@/utils/badge';

export type SocialFraudInfoProps = {
  data?: Reputational['social'];
};

const SocialFraudInfo: React.FC<SocialFraudInfoProps> = ({ data }) => {
  const { t } = useTranslation(['projects', 'common']);

  return (
    <div css={styles.socialFraudInfo}>
      <DataText
        label={t('details.reputational.social.website.label', 'Website Visits')}
        containerCss={styles.websiteVisitsContainer}
      >
        <p>{formatAmount(data?.website?.visits?.count ?? 0)}</p>
        <Badge size="medium" color={getColorBySeverity(data?.website?.visits?.tag?.severity)}>
          {data?.website?.visits?.tag?.label}
        </Badge>
      </DataText>
      <DataText
        label={t('details.reputational.social.interactions.label', 'Interactions')}
        containerCss={styles.websiteVisitsContainer}
      >
        <p>{formatAmount(data?.interactions?.count ?? 0)}</p>
        <Badge size="medium" color={getColorBySeverity(data?.interactions?.tag?.severity)}>
          {data?.interactions?.tag?.label}
        </Badge>
      </DataText>
      <DataText
        label={t('details.reputational.social.googleTrends.label', 'Google Trends')}
        containerCss={styles.websiteVisitsContainer}
      >
        <Badge size="medium" color={getColorBySeverity(data?.googleTrends?.tag?.severity)}>
          {data?.googleTrends?.tag?.label}
        </Badge>
      </DataText>
      <DataText
        label={t('details.reputational.social.bots.label', 'Bots Ratio')}
        containerCss={styles.websiteVisitsContainer}
      >
        <Badge size="medium" color="gray">
          {t('common:main.comingSoon', 'Coming Soon')}
        </Badge>
      </DataText>
    </div>
  );
};

export default SocialFraudInfo;
