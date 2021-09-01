import React, {useImperativeHandle, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Divider from '~/beinComponents/Divider';
import {Text} from '~/components';
import {
  messageOptionData,
  messageOptions,
  MessageOptionType,
  myMessageOptions,
} from '~/constants/chat';
import {IMessageMenu} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';

export interface Props {
  x: number;
  y: number;
  isMyMessage: boolean;
  modalRef?: any;
  onMenuPress: (item: MessageOptionType) => void;
  onReactionPress: (item: any) => void;
  onClosed: () => void;
}

const MessageOptionsModal: React.FC<Props> = ({
  x,
  y,
  isMyMessage,
  modalRef,
  onMenuPress,
  onClosed,
}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(modalRef, () => ({
    open,
    close,
  }));

  const renderItem = ({item}: {item: MessageOptionType; index: number}) => {
    const menu: IMessageMenu = messageOptionData[item];

    return (
      <TouchableOpacity onPress={() => onMenuPress(item)}>
        <View style={styles.itemMenu}>
          <Text useI18n>{`chat:message_option:${menu.label}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _onClosed = () => {
    if (!visible) return;
    setVisible(false);
    onClosed();
  };

  if (x < 0 || y < 0) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={_onClosed}>
        <View style={styles.container}>
          <FlatList
            nativeID="message-context-menu"
            style={[styles.list, {top: y, left: x}]}
            data={isMyMessage ? myMessageOptions : messageOptions}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider />}
            keyExtractor={(item: MessageOptionType) => `message-menu-${item}`}
          />
        </View>
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
    list: {
      position: 'absolute',
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
    itemMenu: {
      marginHorizontal: spacing.margin.large,
      padding: spacing.padding.large,
    },
  });
};

export default React.forwardRef((props: Props, ref?: React.Ref<Props>) => (
  <MessageOptionsModal modalRef={ref} {...props} />
));
