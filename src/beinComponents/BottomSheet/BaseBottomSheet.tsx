import React from 'react';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Portal, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

import {StyleProp, ViewProps} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type FlatListProps = {
  data: any[];
  renderItem: ({index, item}: {index: number; item: any}) => React.ReactNode;
};

export interface BaseBottomSheetProps extends ModalizeProps {
  children?: React.ReactNode;
  modalizeRef: any;
  modalizeProps?: ModalizeProps;

  adjustToContentHeight?: boolean;
  handlePosition?: 'inside' | 'outside';
  snapPoint?: number;
  modalHeight?: number;

  ContentComponent?: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
  FloatingComponent?: React.ReactNode;

  handleStyle?: StyleProp<ViewProps>;
  modalStyle?: StyleProp<ViewProps>;
  childrenStyle?: StyleProp<ViewProps>;
  overlayStyle?: StyleProp<ViewProps>;
}

const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  children,
  modalizeRef,
  modalizeProps,

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
}: BaseBottomSheetProps) => {
  const renderModalize = () => {
    const {spacing}: ITheme = useTheme();
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
          snapPoint={snapPoint}
          modalHeight={modalHeight}
          HeaderComponent={HeaderComponent}
          FooterComponent={FooterComponent}
          FloatingComponent={FloatingComponent}
          flatListProps={flatListProps}
          handlePosition={handlePosition}
          handleStyle={handleStyle}
          modalStyle={_modalStyle}
          overlayStyle={overlayStyle}
          childrenStyle={_childrenStyle}
          {...modalizeProps}>
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
