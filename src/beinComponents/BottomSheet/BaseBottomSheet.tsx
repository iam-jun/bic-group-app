import React, {useEffect} from 'react';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Portal, useTheme} from 'react-native-paper';
import {StyleSheet, ViewStyle, StyleProp, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ITheme} from '~/theme/interfaces';

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

  deltaX?: number;
  deltaY?: number;
  menuMinWidth?: number;
  menuMinHeight?: number;
  isContextMenu?: boolean;

  handleStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  childrenStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;

  onClose?: () => void;
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
    const {spacing}: ITheme = useTheme() as ITheme;
    const insets = useSafeAreaInsets();

    useEffect(() => {
      if (isOpen) {
        Keyboard.dismiss();
        setTimeout(() => {
          modalizeRef?.current?.open?.();
        }, 50);
      }
    }, [isOpen]);

    const _modalStyle = StyleSheet.flatten([
      {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        paddingTop: spacing?.padding.extraLarge,
      },
      modalStyle,
    ]);

    const _childrenStyle = [
      {
        paddingBottom: insets.bottom + (spacing?.padding.large || 16),
      },
      childrenStyle,
    ];

    return (
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={adjustToContentHeight}
          modalHeight={modalHeight}
          snapPoint={snapPoint}
          flatListProps={flatListProps}
          handlePosition={handlePosition}
          handleStyle={handleStyle}
          modalStyle={_modalStyle}
          overlayStyle={overlayStyle}
          childrenStyle={_childrenStyle}
          {...props}>
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

export default BaseBottomSheet;
