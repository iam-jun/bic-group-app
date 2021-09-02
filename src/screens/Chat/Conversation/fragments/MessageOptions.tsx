import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import Icon from '~/beinComponents/Icon';
import {
  messageOptionData,
  messageOptions,
  MessageOptionType,
  myMessageOptions,
  reactions,
} from '~/constants/chat';
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
  const styles = themeStyle(theme);

  const renderReactions = () => {
    return (
      <View style={styles.reactions}>
        {Object.keys(reactions).map(key => (
          <Icon
            key={`reaction-${key}`}
            icon={reactions[key].icon}
            onPress={() => onReactionPress(key)}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({item}: {item: MessageOptionType; index: number}) => {
    const menu: IMessageMenu = messageOptionData[item];

    return (
      <Icon
        style={styles.itemMenu}
        icon={menu.icon}
        label={`chat:message_option:${menu.label}`}
        labelStyle={styles.label}
        onPress={() => onMenuPress(item)}
      />
    );
  };

  return (
    <BottomSheet
      {...props}
      modalizeRef={modalRef}
      side="right"
      onClosed={onClosed}
      flatListProps={{
        style: styles.list,
        data: isMyMessage ? myMessageOptions : messageOptions,
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
      marginTop: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    label: {
      marginStart: spacing.margin.large,
    },
  });
};

export default React.forwardRef((props: Props, ref?: React.Ref<Props>) => (
  <MessageOptionsModal modalRef={ref} {...props} />
));
