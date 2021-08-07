import React from 'react';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Portal, useTheme} from 'react-native-paper';
import {StyleSheet, ViewStyle, StyleProp} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ITheme} from '~/theme/interfaces';

export type FlatListProps = {
  data: any[];
  renderItem: ({index, item}: {index: number; item: any}) => React.ReactNode;
};

export interface BaseBottomSheetProps extends ModalizeProps {
  modalizeRef: any;
  children?: React.ReactNode;

  adjustToContentHeight?: boolean;
  handlePosition?: 'inside' | 'outside';
  snapPoint?: number;
  modalHeight?: number;

  ContentComponent?: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
  FloatingComponent?: React.ReactNode;

  handleStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  childrenStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
}

const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  modalizeRef,
  children,

  flatListProps,
  adjustToContentHeight = true,
  handlePosition = 'inside',
  snapPoint,
  modalHeight,

  ContentComponent,
  HeaderComponent,
  FooterComponent,
  FloatingComponent,

  handleStyle,
  modalStyle,
  childrenStyle,
  overlayStyle,
  ...props
}: BaseBottomSheetProps) => {
  const renderModalize = () => {
    const {spacing}: ITheme = useTheme() as ITheme;
    const insets = useSafeAreaInsets();

    const _modalStyle = StyleSheet.flatten([
      {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        paddingTop: spacing?.padding.extraLarge,
      },
      modalStyle,
    ]);

    const _childrenStyle = StyleSheet.flatten([
      {
        paddingBottom: insets.bottom + (spacing?.padding.large || 16),
      },
      childrenStyle,
    ]);

    return (
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={adjustToContentHeight}
          modalHeight={modalHeight}
          snapPoint={snapPoint}
          HeaderComponent={HeaderComponent}
          FooterComponent={FooterComponent}
          FloatingComponent={FloatingComponent}
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
