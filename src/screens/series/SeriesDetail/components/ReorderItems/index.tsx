import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import i18next from 'i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import spacing from '~/theme/spacing';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ItemsReorderInfo from './ItemsReorderInfo';
import { IPost } from '~/interfaces/IPost';
import ItemReorder, {
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from './ItemReorder';
import ReorderList from '~/beinComponents/ReorderList';
import { isIndexEqualValue } from './helper';
import useSeriesStore from '~/screens/series/store';
import { useRootNavigation } from '~/hooks/navigation';
import useModalStore from '~/store/modal';

const ReorderItems = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};

  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme, insets);
  const { showAlert } = useModalStore((state) => state.actions);

  const { rootNavigation } = useRootNavigation();

  const loading = useSeriesStore((state) => state.loading);
  const series = usePostsStore(
    useCallback(postsSelector.getPost(seriesId, {}), [seriesId]),
  );
  const { id, items } = series;

  const actions = useSeriesStore((state) => state.actions);

  const [itemsIndexOrderState, setItemsIndexOrderState] = useState<number[]>([]);

  const [itemsOrderState, setItemsOrderState] = useState(items?.reduce((acc, cur, index) => ({
    ...acc,
    [items[index].id]: index,
  }), {}));

  const { t } = useBaseHook();

  const isChanged = !isIndexEqualValue(itemsIndexOrderState);

  const onPressSave = () => {
    showAlert({
      title: i18next.t('series:notice_changing_the_order'),
      content: i18next.t('series:notice_sure_to_do_this'),
      cancelBtn: true,
      cancelLabel: i18next.t('common:btn_cancel'),
      confirmLabel: i18next.t('common:btn_confirm'),
      onConfirm: () => {
        actions.reorderItemsInSeries(id, itemsIndexOrderState);
      },
    });
  };

  const handleBack = () => {
    if (isChanged) {
      showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
      return;
    }
    rootNavigation.goBack();
  };

  const renderItem = (item: IPost) => (
    <ItemReorder
      key={`${uuid.v4()}`}
      index={itemsOrderState[item.id]}
      item={item}
    />
  );

  const onChange = (newIndex: number[]) => {
    setItemsIndexOrderState(newIndex);
    const newItemsOrderState = newIndex.reduce((acc, cur, index) => ({
      ...acc,
      [items[cur].id]: index,
    }), itemsOrderState);
    setItemsOrderState(newItemsOrderState);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('series:reorder')}
        onPressButton={onPressSave}
        buttonText="common:btn_save"
        buttonProps={{
          loading,
          disabled: !isChanged,
          useI18n: true,
          style: styles.btnSave,
        }}
        onPressBack={handleBack}
      />
      <ItemsReorderInfo />
      <ReorderList
        data={items}
        renderItem={renderItem}
        itemWidth={ITEM_WIDTH}
        itemHeight={ITEM_HEIGHT}
        onChange={onChange}
        style={styles.reorderListContainer}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    verticalLine: {
      width: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: spacing.margin.large,
      backgroundColor: colors.neutral5,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    reorderListContainer: {
      flex: 1,
      paddingBottom: insets.bottom + spacing.padding.large,
    },
  });
};

export default ReorderItems;
