import React, { useEffect, useRef } from 'react';
import {
  Modal, Platform, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '~/baseComponents/BottomSheet';
import { useKeySelector } from '~/hooks/selector';
import modalActions from '~/storeRedux/modal/actions';
import modalKeySelector from '~/storeRedux/modal/keySelector';
import spacing from '~/theme/spacing';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';

const CommonModal = () => {
  const modalizeRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme()
  const styles = themeStyles(theme);

  const modal = useKeySelector(modalKeySelector.modal);
  const {
    isOpen,
    isFullScreen,
    titleFullScreen,
    ContentComponent,
    props,
    useAppBottomSheet = true,
    closeOutSide = true,
  } = modal || {};

  useEffect(
    () => {
      if (!isOpen) {
        modalizeRef?.current?.close?.();
      }
    }, [isOpen],
  );

  const _onClose = () => {
    closeOutSide && dispatch(modalActions.hideModal());
  };

  if (isFullScreen) {
    return (
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => dispatch(modalActions.hideModal())}
      >
        <View testID="common_modal.center" style={styles.fullScreenContainer}>
          <View style={styles.fullScreenHeader}>
            <Text.H4 style={styles.titleFullScreen} numberOfLines={2}>
              {titleFullScreen}
            </Text.H4>
            <Button style={styles.btnClose} onPress={_onClose}>
              <Icon icon="iconCloseSmall" />
            </Button>
          </View>
          <View style={{ flex: 1 }}>
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
        animationType="slide"
        onRequestClose={() => {
          dispatch(modalActions.hideModal());
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
      {...props}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    appModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(12, 13, 14, 0.5)',
      justifyContent: 'center',
    },
    fullScreenContainer: {
      flex: 1,
      backgroundColor: colors.neutral,
      justifyContent: 'center',
      paddingHorizontal: spacing.padding.small,
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
}

export default CommonModal;
