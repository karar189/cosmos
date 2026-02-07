/** @jsxImportSource @emotion/react */
'use client';

import { motion } from 'motion/react';
import { Core3Button } from '@core3/ui-components';
import { useCooperationModal } from '@/components/layouts/PlatformLayout';
import * as styles from './CTARow.styles';

const MotionTr = motion.tr;

export interface CTARowProps {
  title: string;
  buttonText: string;
  colSpan: number;
}

export default function CTARow({ title, buttonText, colSpan }: CTARowProps) {
  const { openCooperationModal } = useCooperationModal();

  return (
    <MotionTr
      key="cta-row"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <td colSpan={colSpan} css={styles.ctaCell}>
        <div css={styles.ctaCellInner}>
          <div css={styles.ctaTitle}>
            {title}
          </div>
          <Core3Button size="small" onClick={openCooperationModal}>
            {buttonText}
          </Core3Button>
        </div>
      </td>
    </MotionTr>
  );
}

