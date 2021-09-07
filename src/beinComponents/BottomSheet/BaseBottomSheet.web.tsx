import React, {useImperativeHandle, useState} from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {MessageOptionType} from '~/constants/chat';
import {ITheme} from '~/theme/interfaces';
import Div from '../Div';

export interface Props {
  isOpen?: boolean;
  children?: React.ReactNode;
  flatListProps?: FlatListProps<any>;
  modalizeRef?: any;
  side?: 'left' | 'right';
  ContentComponent?: React.ReactNode;
  onMenuPress: (item: MessageOptionType) => void;
  onClose: () => void;
}

const BaseBottomSheet: React.FC<Props> = ({
  modalizeRef,
  flatListProps,
  ContentComponent,
  side,

  onClose,
}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({x: -1, y: -1});
  const [boxSize, setBoxSize] = useState<{width: number; height: number}>({
    width: 250, //For first time, onLayout have not triggered yet
    height: 200,
  });

  const open = (x: number, y: number) => {
    let _x = Dimensions.get('window').width / 2 - boxSize.width / 2;
    let _y = Dimensions.get('window').height / 2 - boxSize.height / 2;
    if (x) _x = side === 'left' ? x - boxSize.width : x;
    if (y)
      _y =
        y + boxSize.height + 100 > Dimensions.get('window').height
          ? y - boxSize.height
          : y;

    setPosition({x: _x, y: _y});
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
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

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      _onClosed();
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setBoxSize({...e.nativeEvent.layout});
  };

  if (position.x < 0 || position.y < 0) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={_onClosed}>
        <Div onKeyDown={onKeyDown} style={styles.container}>
          <View
            onLayout={onLayout}
            style={[styles.menu, {left: position.x, top: position.y}]}>
            {flatListProps ? <FlatList {...flatListProps} /> : ContentComponent}
          </View>
        </Div>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
    },
    menu: {
      position: 'absolute',
      borderRadius: spacing.borderRadius.base,
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
  });
};

BaseBottomSheet.defaultProps = {
  side: 'left',
};

export default BaseBottomSheet;
