/** @jsxImportSource @emotion/react */
'use client';
import React from 'react';
import { motion } from 'motion/react';
import * as styles from './InfoList.styles';
import InfoListItem from './InfoListItem';

export interface InfoListProps {
  items: {
    title: string;
    description: string;
  }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const MotionDiv = motion.div;

const InfoList: React.FC<InfoListProps> = ({ items }) => {
  const getCount = (index: number) => {
    if (index < 10) {
      return `0${index + 1}`;
    }
    return index + 1;
  };

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      css={styles.infoList}
    >
      {items.map((item, index) => (
        <InfoListItem
          key={`info-list-item-${index}`}
          title={item.title}
          description={item.description}
          count={getCount(index)}
        />
      ))}
    </MotionDiv>
  );
};

export default InfoList;
