/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, useState } from 'react';
import DraggableFlatList, { ShadowDecorator } from 'react-native-draggable-flatlist';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  View, StyleSheet, TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isEqual } from 'lodash';
import PinContentItem from '~/components/PinContent/components/BoxListPinContent/components/PinContentItem';
import usePinContentStore from '~/components/PinContent/store';
import { spacing } from '~/theme';
import Header from '~/beinComponents/Header';
import showAlert from '~/store/helper/showAlert';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';

type ReorderedPinContentProps = {
    route: {
        params: {
          groupId: string
        },
    }
}

const ReorderedPinContent: FC<ReorderedPinContentProps> = (props) => {
  const { params } = props.route || {};
  const { groupId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const pinContent = usePinContentStore((state) => state.groupPinContent[groupId]);
  const isLoading = usePinContentStore((state) => state.isLoading);
  const actionsPinContentStore = usePinContentStore((state) => state.actions);
  const { data = [] } = pinContent || {};

  const [pinContentDataState, setPinContentDataState] = useState(data);

  const isChanged = !isEqual(data, pinContentDataState);
  const disabled = !isChanged || isLoading;

  const renderItem = ({ item, drag, isActive }) => (
    <ShadowDecorator>
      <TouchableWithoutFeedback onLongPress={drag} disabled={isActive}>
        <View style={styles.containerItem}>
          <PinContentItem contentId={item} id={groupId} isActiveAnimation={isActive} />
        </View>
      </TouchableWithoutFeedback>
    </ShadowDecorator>
  );

  const keyExtractor = (item) => `pin-content-item-${item}`;

  const onSave = () => {
    actionsPinContentStore.reorderPinContentGroup(pinContentDataState, groupId);
  };

  const handleBack = () => {
    if (isChanged) {
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(handleBack);

  const onDragEnd = ({ data: orderedData }) => {
    setPinContentDataState(orderedData);
  };

  const renderFooter = () => (
    <ViewSpacing height={spacing.padding.large + insets.bottom} />
  );

  const renderSeparator = () => (
    <ViewSpacing height={spacing.padding.large} />
  );

  const renderTip = () => (
    <View style={styles.containerTip}>
      <Icon
        icon="CircleInfo"
        size={18}
        tintColor={colors.neutral20}
      />
      <ViewSpacing width={spacing.padding.small} />
      <Text.BodyS useI18n color={colors.neutral40}>pin:drag_and_drop_to_reorder_pinned</Text.BodyS>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <Header
        useI18n
        title="pin:reorder_pinned"
        buttonProps={{ disabled, loading: isLoading, style: styles.btnSave }}
        buttonText="common:btn_save"
        onPressButton={onSave}
        onPressBack={handleBack}
      />
      {renderTip()}
      <DraggableFlatList
        containerStyle={styles.listContainer}
        contentContainerStyle={styles.contentContainer}
        data={pinContentDataState}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        onDragEnd={onDragEnd}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.neutral2,
    },
    listContainer: {
      flex: 1,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
    },
    containerItem: {
      height: 280,
      width: '100%',
    },
    containerTip: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.neutral1,
    },
  });
};

export default ReorderedPinContent;
