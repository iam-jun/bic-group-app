import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import SeriesItemModal from './SeriesItemModal';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import useSeriesContentModalStore from './store';
import { IGetSeries } from '~/interfaces/ISeries';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useModalStore from '~/store/modal';

interface ISeriesContentModalProps {
    id: string;
}

const SeriesContentModal: React.FC<ISeriesContentModalProps> = ({ id }) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const modalActions = useModalStore((state) => state.actions);
  const { data, loading } = useSeriesContentModalStore((state) => state.series);
  const actions = useSeriesContentModalStore((state) => state.actions);
  const reset = useSeriesContentModalStore((state) => state.reset);

  useEffect(() => {
    getData();

    return reset;
  }, []);

  const getData = () => {
    const payload: IGetSeries = {
      itemIds: [id],
    };
    actions.getSeriesByItems(payload);
  };

  const onLoadMore = () => {
    getData();
  };

  const onPressClose = () => {
    modalActions.hideModal();
  };

  const onPressItem = (item: any) => {
    onPressClose();
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: item?.id });
  };

  const renderHeaderComponent = () => <ViewSpacing height={spacing.margin.base} />;

  const renderItem = ({ item }: any) => (
    <SeriesItemModal
      data={item}
      onPressItem={() => onPressItem(item)}
    />
  );

  const renderEmptyComponent = () => {
    if (loading) return <LoadingIndicator style={styles.loading} />;

    return (
      <View style={styles.boxEmpty} testID="series_content_modal.box_empty">
        <Image
          resizeMode="contain"
          source={images.img_empty_box}
          style={styles.imgEmpty}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          common:text_no_series_modal
        </Text.BodyS>
      </View>
    );
  };

  const keyExtractor = (item, index) => `series_${item?.id || index}`;

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={renderHeaderComponent}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    boxEmpty: {
      alignItems: 'center',
      marginTop: spacing.margin.base,
      paddingVertical: 32,
    },
    imgEmpty: {
      width: 100,
      aspectRatio: 1,
      marginBottom: spacing.margin.large,
    },
    loading: {
      marginTop: spacing.margin.large,
    },
  });
};

export default SeriesContentModal;
