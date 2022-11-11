import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import DeletedItem from '../DeletedItem';
import SeriesContent from '../SeriesContent';
import SeriesHeader from '../SeriesHeader';

type SeriesItemProps = {
    id: string;
}

const SeriesItem: FC<SeriesItemProps> = ({ id: seriesId }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const series = usePostsStore(useCallback(postsSelector.getPost(seriesId, {}), [seriesId]));
  const { deleted = false } = series;

  if (deleted) {
    return <DeletedItem />;
  }

  return (
    <View style={styles.container}>
      <SeriesHeader
        series={series}
        disabled={false}
      />
      <SeriesContent series={series} />
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
