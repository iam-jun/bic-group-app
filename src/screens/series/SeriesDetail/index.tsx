import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import SeriesDetailHeader from './components/SeriesDetailHeader';

const SeriesDetail = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};
  const theme = useTheme();
  const styles = createStyle(theme);

  const series = usePostsStore(useCallback(postsSelector.getPost(seriesId), [seriesId]));

  const onRightPress = () => {
    // do something
  };

  return (
    <View style={styles.container}>
      <Header
        rightIcon="menu"
        onRightPress={onRightPress}
      />
      <SeriesDetailHeader series={series} />
      {/* for the next sprint */}
      {/* list SeriesDetailArticleItem */}
      {/* <SeriesDetailArticleItem
        index={1}
        article={article_from_series}
      /> */}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
  });
};

export default SeriesDetail;
