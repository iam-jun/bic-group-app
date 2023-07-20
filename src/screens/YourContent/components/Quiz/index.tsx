import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  StyleSheet, RefreshControl, View, ActivityIndicator,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Image from '~/components/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import { homeHeaderTabHeight } from '~/theme/dimension';
import useDraftQuizStore from './store';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import QuizPostView from './components/QuizPostView';

interface QuizProps {
    onScroll: (e: any) => void;
}

const Quiz: React.FC<QuizProps> = ({ onScroll }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { draftQuiz, actions } = useDraftQuizStore();
  const {
    data,
    loading,
    refreshing,
    hasNextPage,
  } = draftQuiz || {};

  useEffect(() => {
    getData(true);
  }, []);

  const getData = (isRefresh?: boolean) => {
    actions.getDraftQuiz(isRefresh);
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(false);
    }
  };

  const renderItem = ({ item }) => (<QuizPostView data={item} />);

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
      <View style={styles.boxEmpty} testID="draft_quiz.empty_view">
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

  const keyExtractor = (item) => `draft-quiz-${item?.id}`;

  return (
    <Animated.FlatList
      testID="quiz.list"
      data={data}
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
          progressViewOffset={homeHeaderTabHeight}
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
    paddingTop: homeHeaderTabHeight,
  },
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Quiz;
