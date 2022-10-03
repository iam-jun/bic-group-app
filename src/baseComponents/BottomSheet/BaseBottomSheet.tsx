import React, { useEffect } from 'react';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import {
  ViewStyle, StyleProp, Keyboard, StyleSheet,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';

import spacing from '~/theme/spacing';

export interface BaseBottomSheetProps extends ModalizeProps {
  modalizeRef: any;
  isOpen?: boolean;
  children?: React.ReactNode;
  adjustToContentHeight?: boolean;
  handlePosition?: 'inside' | 'outside';
  snapPoint?: number;
  modalHeight?: number;
  position?: {x: number; y: number};
  ContentComponent?: React.ReactNode;
  handleStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  childrenStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
}

const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  isOpen,
  modalizeRef,
  children,
  flatListProps,
  adjustToContentHeight = true,
  handlePosition = 'inside',
  snapPoint,
  modalHeight,
  ContentComponent,
  handleStyle,
  modalStyle,
  childrenStyle,
  overlayStyle,
  ...props
}: BaseBottomSheetProps) => {
  const renderModalize = () => {
    const insets = useSafeAreaInsets();
    const styles = createStyles(insets);

    useEffect(
      () => {
        if (isOpen) {
          Keyboard.dismiss();
          setTimeout(
            () => {
              modalizeRef?.current?.open?.();
            }, 50,
          );
        }
      }, [isOpen],
    );

    return (
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={adjustToContentHeight}
          modalHeight={modalHeight}
          snapPoint={snapPoint}
          handlePosition={handlePosition}
          handleStyle={handleStyle}
          modalStyle={[styles.modalStyle, modalStyle]}
          overlayStyle={overlayStyle}
          childrenStyle={[styles.childrenStyle, childrenStyle]}
          flatListProps={flatListProps}
          {...props}
        >
          {flatListProps ? undefined : ContentComponent}
        </Modalize>
      </Portal>
    );
  };

  return (
    <>
      {children}
      {renderModalize()}
    </>
  );
};

const createStyles = (insets: EdgeInsets) => StyleSheet.create({
  modalStyle: {
    borderTopRightRadius: spacing.borderRadius.extraLarge,
    borderTopLeftRadius: spacing.borderRadius.extraLarge,
    paddingTop: spacing.padding.extraLarge,
  },
  childrenStyle: {
    paddingBottom: insets.bottom + spacing.padding.large,
  },
});

export default BaseBottomSheet;
