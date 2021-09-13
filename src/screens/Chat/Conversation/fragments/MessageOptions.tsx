import i18next from 'i18next';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import Div from '~/beinComponents/Div';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
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
  const {colors} = theme;
  const styles = themeStyle(theme);
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  const renderReactions = () => {
    if (Platform.OS === 'web') return null;

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
    const menu = messageOptionData[item] as IMessageMenu;
    const backgroundColor =
      item === hoverItem ? colors.placeholder : colors.background;

    return (
      <PrimaryItem
        style={styles.itemMenu}
        leftIcon={menu.icon}
        leftIconProps={{icon: menu.icon, size: 24}}
        title={i18next.t(`chat:message_option:${menu.label}`)}
        onPress={() => onMenuPress(item)}
      />
    );
  };

  const data = isMyMessage ? myMessageOptions : messageOptions;

  return (
    <BottomSheet
      {...props}
      modalizeRef={modalRef}
      side="left"
      onClosed={onClosed}
      flatListProps={{
        style: styles.list,
        data: data,
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
      paddingVertical: spacing.padding.tiny,
    },
    reactions: {
      paddingBottom: spacing.padding.large,
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: colors.placeholder,
    },
    itemMenu: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
    label: {
      marginStart: spacing.margin.large,
    },
  });
};

export default React.forwardRef((props: Props, ref?: React.Ref<Props>) => (
  <MessageOptionsModal modalRef={ref} {...props} />
));
