import React, {useEffect, useImperativeHandle, useState} from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  Keyboard,
  LayoutChangeEvent,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme, Modal as PaperModal} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

export interface Props {
  isOpen?: boolean;
  children?: React.ReactNode;
  flatListProps?: FlatListProps<any>;
  modalizeRef?: any;
  side?: 'left' | 'right' | 'center';
  ContentComponent?: React.ReactNode;
  position?: {
    x: number;
    y: number;
  };

  deltaX?: number;
  deltaY?: number;
  menuMinWidth?: number;
  menuMinHeight?: number;
  isContextMenu?: boolean;
  modalStyle?: StyleProp<ViewStyle>;
  webModalStyle?: StyleProp<ViewStyle>;

  onClose: () => void;
}

const BaseBottomSheet: React.FC<Props> = ({
  children,
  modalizeRef,
  flatListProps,
  ContentComponent,
  side,
  isOpen,
  position,
  deltaX = 0,
  deltaY = 0,
  menuMinWidth,
  menuMinHeight,
  isContextMenu = true,
  webModalStyle,
  onClose,
}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);
  const [visible, setVisible] = useState(false);
  const [initPosition, setInitPosition] = useState<{
    x: number;
    y: number;
  }>({x: -1, y: -1});
  const [_position, setPosition] = useState<{
    x: number;
    y: number;
  }>({x: -1, y: -1});

  const [boxSize, setBoxSize] = useState<{width: number; height: number}>({
    width: -1, //For first time, onLayout have not triggered yet
    height: -1,
  });

  const hideModal = false; //_position.x < 0 || _position.y < 0;

  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
      setInitPosition({x: position?.x || -1, y: position?.y || -1});

      open(position?.x, position?.y);
    }
  }, [isOpen]);

  useEffect(() => {
    // recalculate and update position
    calculatePosition(initPosition?.x, initPosition?.y);
  }, [boxSize]);

  const calculatePosition = (x?: number, y?: number) => {
    let _x = (Dimensions.get('window').width - boxSize.width) / 2;
    let _y = (Dimensions.get('window').height - boxSize.height) / 2;
    if (x) {
      if (side === 'left') _x = x - boxSize.width;
      else if (side === 'center') _x = x - boxSize.width / 2;
      else _x = x;
    }
    if (y)
      _y =
        y + boxSize.height > Dimensions.get('window').height
          ? y - boxSize.height
          : y;

    setPosition({x: _x + deltaX, y: _y + deltaY});
  };

  const open = (x?: number, y?: number) => {
    setInitPosition({x: x || -1, y: y || -1});
    calculatePosition(x, y);
    !visible && setVisible(true);
  };

  const close = () => {
    _onClosed();
  };

  useImperativeHandle(modalizeRef, () => ({
    open,
    close,
  }));

  const _onClosed = () => {
    if (!visible) return;
    setVisible(false);
    onClose?.();
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setBoxSize({...e.nativeEvent.layout});
  };

  return (
    <>
      {children}
      {!hideModal &&
        (isContextMenu ? (
          <Modal transparent animationType="fade" visible={visible}>
            <TouchableWithoutFeedback onPress={_onClosed}>
              <View style={styles.menuContainer}>
                <View
                  onLayout={onLayout}
                  style={[
                    styles.menu,
                    {opacity: boxSize.width > 0 ? 1 : 0},
                    {left: _position.x, top: _position.y},
                    {minWidth: menuMinWidth, minHeight: menuMinHeight},
                  ]}>
                  {flatListProps ? (
                    <FlatList {...flatListProps} />
                  ) : (
                    ContentComponent
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          (!!ContentComponent || !!flatListProps) && (
            <PaperModal
              visible={visible}
              dismissable
              onDismiss={_onClosed}
              contentContainerStyle={StyleSheet.flatten([
                styles.modalContainer,
                webModalStyle,
              ])}>
              {flatListProps ? (
                <FlatList {...flatListProps} />
              ) : (
                ContentComponent
              )}
            </PaperModal>
          )
        ))}
    </>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    menuContainer: {
      width: '100%',
      height: '100%',
    },
    modalContainer: {
      minWidth: 320,
      minHeight: 400,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: spacing.borderRadius.small,
      alignSelf: 'center',
    },
    menu: {
      position: 'absolute',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.bgSecondary,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 16,
    },
  });
};

BaseBottomSheet.defaultProps = {
  side: 'left',
};

export default BaseBottomSheet;
