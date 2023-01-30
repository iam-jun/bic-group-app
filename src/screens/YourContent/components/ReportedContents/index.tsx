import {
  ActivityIndicator,
  FlatList, RefreshControl, StyleSheet, View,
} from 'react-native';
import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import BannerReport from '~/components/Report/BannerReport';
import useReportContentStore from '~/components/Report/store';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import ContentItem from '~/components/ContentItem';

const ReportedContents = () => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles();

  const {
    ids, loading, refreshing,
  } = useReportContentStore((state) => state.reportedContents) || {};
  const actions = useReportContentStore((state) => state.actions);

  useEffect(() => {
    if (ids?.length === 0) {
      getData(true);
    }
  }, []);

  const getData = (isRefresh = false) => {
    actions.getReportedContents(isRefresh);
  };

  const onRefresh = () => {
    getData(true);
  };

  const onLoadMore = () => {
    getData();
  };

  const renderItem = ({ item }: {item: string}) => (
    <>
      <BannerReport postId={item} />
      <ContentItem id={item} shouldHideBannerImportant />
    </>
  );

  const renderEmptyComponent = () => {
    if (refreshing) return null;

    return (
      <View style={styles.boxEmpty}>
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={theme.colors.neutral40} useI18n>
          your_content:text_no_reported_content
        </Text.BodyS>
      </View>
    );
  };

  const renderHeaderComponent = () => <ViewSpacing height={spacing.margin.large} />;

  const renderFooterComponent = () => {
    if (!loading) return <ViewSpacing height={insets.bottom || spacing.padding.large} />;

    return (
      <View style={styles.boxFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.large} />;

  const keyExtractor = (item: string) => `reported-contents-${item}`;

  return (
    <FlatList
      data={ids}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparatorComponent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

export default ReportedContents;

const createStyles = () => StyleSheet.create({
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
