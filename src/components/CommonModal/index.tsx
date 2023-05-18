import React, { useEffect, useRef } from 'react';
import {
  Modal, Platform, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '~/baseComponents/BottomSheet';
import spacing from '~/theme/spacing';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ModalHeader from '~/components/CommonModal/components/ModalHeader';
import useModalStore from '~/store/modal';

const CommonModal = () => {
  const modalizeRef = useRef<any>();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const actions = useModalStore((state) => state.actions);
  const {
    isOpen,
    isFullScreen,
    titleFullScreen,
    headerFullScreenProps,
    ContentComponent,
    props,
    useAppBottomSheet = true,
    closeOutSide = true,
    animationType = 'slide',
  } = useModalStore((state) => state.modal) || {};

  useEffect(
    () => {
      if (!isOpen) {
        modalizeRef?.current?.close?.();
      }
    }, [isOpen],
  );

  const _onClose = () => {
    if (!closeOutSide) return;
    actions.hideModal();
  };

  if (isFullScreen) {
    return (
      <Modal
        visible={isOpen}
        transparent
        animationType={animationType}
        onRequestClose={() => actions.hideModal()}
      >
        <View testID="common_modal.center" style={styles.fullScreenContainer}>
          {!!headerFullScreenProps ? <ModalHeader {...headerFullScreenProps} /> : (
            <View style={styles.fullScreenHeader}>
              <Text.H4 style={styles.titleFullScreen} numberOfLines={2} useI18n>
                {titleFullScreen}
              </Text.H4>
              <Button style={styles.btnClose} onPress={_onClose}>
                <Icon icon="iconCloseSmall" />
              </Button>
            </View>
          )}
          <View style={styles.flex1}>
            {ContentComponent}
          </View>
        </View>
      </Modal>
    );
  }

  if (!useAppBottomSheet) {
    return (
      <Modal
        visible={isOpen}
        transparent
        animationType={animationType}
        onRequestClose={() => {
          actions.hideModal();
        }}
      >
        <TouchableOpacity
          testID="common_modal.center"
          activeOpacity={1}
          style={styles.appModalContainer}
          onPress={_onClose}
        >
          {ContentComponent}
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      isOpen={isOpen}
      onClose={_onClose}
      ContentComponent={ContentComponent}
      scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
      {...props}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    flex1: { flex: 1 },
    appModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(12, 13, 14, 0.5)',
      justifyContent: 'center',
    },
    fullScreenContainer: {
      flex: 1,
      backgroundColor: colors.neutral,
      justifyContent: 'center',
      paddingTop: Platform.OS === 'android' ? 0 : insets.top,
      paddingBottom: insets.bottom + spacing.padding.small,
    },
    fullScreenHeader: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
    },
    titleFullScreen: {
      flex: 1,
      marginLeft: spacing.margin.large,
      paddingVertical: spacing.padding.small,
    },
    btnClose: { paddingHorizontal: spacing.padding.extraLarge },
  });
};

export default CommonModal;
