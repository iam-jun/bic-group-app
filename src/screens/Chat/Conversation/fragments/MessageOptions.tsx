import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import Div from '~/beinComponents/Div';
import Icon from '~/beinComponents/Icon';
import {
  chatPermissions,
  messageOptionData,
  messageOptions,
  MessageOptionType,
  myMessageOptions,
  reactions,
} from '~/constants/chat';
import useChat from '~/hooks/chat';
import {IMessageMenu} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';

export interface Props {
  isMyMessage: boolean;
  modalRef?: any;
  onMenuPress: (item: MessageOptionType) => void;
  onReactionPress: (item: any) => void;
  onClosed: () => void;
}

const MessageOptionsModal: React.FC<Props> = ({
  isMyMessage,
  modalRef,
  onMenuPress,
  onReactionPress,
  onClosed,
  ...props
}: Props) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyle(theme);
  const {conversation} = useChat();
  const [hoverItem, setHoverItem] = useState<any>();

  const renderReactions = () => {
    if (Platform.OS === 'web') return null;
    return (
      <View style={styles.reactions}>
        {Object.keys(reactions).map(key => (
          <Icon
            key={`reaction-${key}`}
            //@ts-ignore
            icon={reactions[key].icon}
            onPress={() => onReactionPress(key)}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({item}: {item: MessageOptionType; index: number}) => {
    const menu = messageOptionData[item] as IMessageMenu;
    const backgroundColor =
      item === hoverItem ? colors.placeholder : colors.background;
    return (
      <Div onHover={() => setHoverItem(item)} onBlur={() => setHoverItem(null)}>
        <Icon
          style={styles.itemMenu}
          backgroundColor={backgroundColor}
          icon={menu.icon}
          label={`chat:message_option:${menu.label}`}
          labelStyle={styles.label}
          onPress={() => onMenuPress(item)}
        />
      </Div>
    );
  };

  let _data = isMyMessage ? myMessageOptions : messageOptions;
  if (conversation?.permissions?.[chatPermissions.CAN_PIN_MESSAGE])
    _data = ['pin', ..._data];

  return (
    <BottomSheet
      {...props}
      modalizeRef={modalRef}
      side="left"
      onClosed={onClosed}
      flatListProps={{
        style: styles.list,
        data: _data,
        keyExtractor: (item: MessageOptionType) => `message-menu-${item}`,
        renderItem: renderItem,
        ListHeaderComponent: renderReactions,
      }}
    />
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    list: {
      minWidth: 250,
      padding: spacing.padding.large,
    },
    reactions: {
      paddingBottom: spacing.padding.large,
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: colors.placeholder,
    },
    itemMenu: {
      padding: spacing.margin.base,
    },
    label: {
      marginStart: spacing.margin.large,
    },
  });
};

export default React.forwardRef((props: Props, ref?: React.Ref<Props>) => (
  <MessageOptionsModal modalRef={ref} {...props} />
));
