import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  View, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import useYourContentStore from '../../store';
import { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Image from '~/components/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import useScheduledContentsStore from './store';
import ScheduledItem from './ScheduledItem';

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

interface ScheduledProps {
    onScroll: (e: any) => void;
}

const Scheduled: React.FC<ScheduledProps> = ({ onScroll }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const activeScheduledTab = useYourContentStore((state) => state.activeScheduledTab);

  const scheduledFeed = useScheduledContentsStore((state) => state.scheduledFeed);
  const actions = useScheduledContentsStore((state) => state.actions);

  const data = scheduledFeed[activeScheduledTab];
  const {
    ids, loading, refreshing, hasNextPage,
  } = data || {};

  useEffect(() => {
    getData(true);
  }, [activeScheduledTab]);

  const getData = (isRefresh: boolean) => {
    actions.getScheduledContents(activeScheduledTab, isRefresh);
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      getData(false);
    }
  };

  const renderItem = ({ item }) => (
    <ScheduledItem idContent={item} />
  );

  const keyExtractor = (item) => `schedule-content-${item}`;

  const renderHeaderComponent = () => (
    <View style={styles.header}>
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );

  const renderFooterComponent = () => {
    if (!loading) return <ViewSpacing height={spacing.padding.extraLarge} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (hasNextPage) return null;

    return (
      <View style={styles.boxEmpty} testID="scheduled.empty_view">
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          your_content:text_empty
        </Text.BodyS>
      </View>
    );
  };

  const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.large} />;

  return (
    <Animated.FlatList
      testID="scheduled.content"
      data={ids}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparatorComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
          progressViewOffset={HeaderFilterHeight}
        />
            )}
    />
  );
};

const createStyle = () => StyleSheet.create({
  header: {
    paddingTop: HeaderFilterHeight,
  },
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});

export default Scheduled;
