import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import DeletedItem from '../../DeletedItem';
import SeriesContent from '../SeriesContent';
import SeriesHeader from '../SeriesHeader';
import { PostImportant } from '~/components/posts';

type SeriesItemProps = {
    data: IPost;
    isLite?: boolean;
}

const SeriesItem: FC<SeriesItemProps> = ({ data: series, isLite }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const {
    communities,
    setting,
    markedReadPost,
  } = series || {};

  const {
    isImportant, importantExpiredAt,
  } = setting || {};

  const { deleted = false } = series || {};

  if (deleted) {
    return <DeletedItem />;
  }

  const renderImportant = () => (
    <PostImportant
      isImportant={!!isImportant}
      expireTime={importantExpiredAt}
      markedReadPost={markedReadPost}
      listCommunity={communities}
    />
  );

  return (
    <View style={styles.container}>
      {renderImportant()}
      <SeriesHeader
        series={series}
        disabled={false}
      />
      <SeriesContent series={series} isLite={isLite} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      ...elevations.e2,
    },
  });
};

export default SeriesItem;
