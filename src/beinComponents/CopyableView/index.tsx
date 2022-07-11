import Clipboard from '@react-native-clipboard/clipboard';
import React, {useRef, useState} from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {showHideToastMessage} from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';
import ButtonWrapper from '../Button/ButtonWrapper';
import Text from '../Text';

interface Props {
  content: string;
  children: any;
  disabled?: boolean;
  onPress?: () => void;
  onSelect?: () => void;
  [x: string]: any;
}

const CopyableView = ({
  content,
  children,
  disabled,
  onPress,
  ...props
}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltopPosition, setTooltipPosition] = useState({left: 0, top: 0});
  const tooltipSize = useRef({width: 50, height: 40});

  const showTooltip = (left: number, top: number) => {
    setTooltipVisible(true);
    setTooltipPosition({left, top});
  };
  const hideTooltip = () => setTooltipVisible(false);

  const copyContent = () => {
    Clipboard.setString(content);
    dispatch(
      showHideToastMessage({
        content: 'common:text_copied_to_clipboard',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      }),
    );
    hideTooltip();
  };

  const _onPress = () => {
    if (tooltipVisible) {
      hideTooltip();
      return;
    }
    if (!disabled) onPress?.();
  };

  const onLongPress = (event: GestureResponderEvent) => {
    showTooltip(
      event.nativeEvent.pageX - tooltipSize.current.width / 2,
      event.nativeEvent.pageY - tooltipSize.current.height,
    );
  };

  const onDismiss = () => {
    hideTooltip();
  };

  const onLayout = (event: LayoutChangeEvent) => {
    tooltipSize.current = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    };
  };

  return (
    <TouchableWithoutFeedback
      {...props}
      onLongPress={onLongPress}
      onPress={_onPress}>
      <View>
        {tooltipVisible && (
          <Modal visible={tooltipVisible} transparent>
            <TouchableWithoutFeedback onPress={onDismiss}>
              <View style={styles.overlay}>
                <ButtonWrapper
                  style={[styles.tooltip, tooltopPosition]}
                  onLayout={onLayout}
                  onPress={copyContent}>
                  <Text useI18n style={styles.text}>
                    common:btn_copy
                  </Text>
                </ButtonWrapper>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <View style={tooltipVisible && styles.contentSelected}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    contentSelected: {
      backgroundColor: '#ACCEF7',
    },
    overlay: {
      flex: 1,
    },
    tooltip: {
      alignSelf: 'baseline',
      backgroundColor: colors.onSurface,
      padding: spacing.padding.base,
      borderRadius: spacing.borderRadius.small,
    },
    text: {
      color: colors.textReversed,
    },
  });
};

export default CopyableView;
