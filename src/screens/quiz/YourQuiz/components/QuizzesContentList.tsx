import React, { useEffect } from 'react';
import {
  StyleSheet, RefreshControl, View, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import Animated from 'react-native-reanimated';
import Image from '~/components/Image';
import images from '~/resources/images';
import { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ContentQuizItem from './ContentQuizItem';
import useYourQuizStore from '../store';

interface QuizzesContentListProps {
  onScroll: (e: any) => void;
}

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

const QuizzesContentList: React.FC<QuizzesContentListProps> = ({ onScroll }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { attributeFilter, contentFilter } = useYourQuizStore((state) => state);
  const data = useYourQuizStore((state) => state.data);
  const actions = useYourQuizStore((state) => state.actions);

  const {
    ids,
    loading,
    refreshing,
    hasNextPage
  } = data[contentFilter][attributeFilter] || {};

  useEffect(() => {
    getData(true);
  }, [attributeFilter, contentFilter]);

  const getData = (isRefresh?: boolean) => {
    actions.getQuizzesContent(isRefresh);
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(false);
    }
  };

  const renderItem = ({ item }) => (<ContentQuizItem contentId={item} />);

  const renderHeader = () => (
    <View style={styles.header}>
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );

  const renderFooter = () => {
    if (!loading) return <ViewSpacing height={spacing.padding.large} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.large} />;

  const renderEmpty = () => {
    if (hasNextPage) return null;

    return (
      <View style={styles.boxEmpty} testID="quiz_content.empty_view">
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          quiz:text_no_quiz_content
        </Text.BodyS>
      </View>
    );
  };

  const keyExtractor = (item) => `quiz-content-${item}`;

  return (
    <Animated.FlatList
      testID="quiz.list"
      data={ids}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={renderSeparatorComponent}
      ListEmptyComponent={renderEmpty}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gray40}
          progressViewOffset={HeaderFilterHeight}
        />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
    />
  );
};

const styles = StyleSheet.create({
  boxEmpty: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 48,
  },
  imgEmpty: {
    width: 100,
    aspectRatio: 1,
    marginBottom: spacing.margin.base,
  },
  header: {
    paddingTop: HeaderFilterHeight,
  },
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuizzesContentList;
