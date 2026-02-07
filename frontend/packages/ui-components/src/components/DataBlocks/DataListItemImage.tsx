/** @jsxImportSource @emotion/react */
'use client';
import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import * as styles from './DataListItem.styles';
export interface DataListItemImageProps extends ImageProps {}

const DataListItemImage: React.FC<DataListItemImageProps> = ({ ...props }) => {
  const [error, setError] = useState(false);
  const handleError = () => {
    setError(true);
  };
  return <Image fill css={styles.dataListItemImage(error)} onError={handleError} {...props} />;
};

export default DataListItemImage;
