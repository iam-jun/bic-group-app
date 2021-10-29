import i18next from 'i18next';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {isEmpty} from 'lodash';

import BottomSheet from '~/beinComponents/BottomSheet';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {
  messageOptionData,
  messageOptions,
  MessageOptionType,
  myMessageOptions,
} from '~/constants/chat';
import {IMessage, IMessageMenu} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';
import {quickReactions} from '~/configs/reactionConfig';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import NodeEmoji from 'node-emoji';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface Props {
  isMyMessage: boolean;
  modalRef?: any;
  selectedMessage?: IMessage;
  onMenuPress: (item: MessageOptionType) => void;
  onReactionPress: (item: any) => void;
  onClosed: () => void;
}

const MessageOptionsModal: React.FC<Props> = ({
  isMyMessage,
  modalRef,
  selectedMessage,
  onMenuPress,
  onReactionPress,
  onClosed,
  ...props
}: Props) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme, insets);

  const renderReactItem = (emoji: any, index: number) => {
    return (
      <Button
        key={`reaction_item_${index}`}
        onPress={() => onReactionPress(NodeEmoji.find(emoji || '')?.key || '')}>
        <Text style={{fontSize: 24, lineHeight: 30}}>{emoji}</Text>
      </Button>
    );
  };

  const renderReact = () => {
    if (Platform.OS === 'web') return null;

    return (
      <View style={styles.reactContainer}>
        {quickReactions.map(renderReactItem)}
        <Button
          style={styles.btnReact}
          onPress={() => onReactionPress?.('add_react')}>
          <Icon icon={'iconReact'} size={22} />
        </Button>
      </View>
    );
  };

  const renderItem = (item: MessageOptionType, index: number) => {
    const menu = messageOptionData[item] as IMessageMenu;

    return (
      <PrimaryItem
        key={`message_options_${index}`}
        style={styles.itemMenu}
        leftIcon={menu.icon}
        leftIconProps={{icon: menu.icon, size: 24}}
        title={i18next.t(`chat:message_option:${menu.label}`)}
        onPress={() => onMenuPress(item)}
      />
    );
  };

  let data = isMyMessage
    ? (myMessageOptions as MessageOptionType[])
    : (messageOptions as MessageOptionType[]);
  data = isEmpty(selectedMessage?.reaction_counts)
    ? data
    : [...data, 'reactions'];

  return (
    <BottomSheet
      {...props}
      modalizeRef={modalRef}
      side="left"
      onClosed={onClosed}
      ContentComponent={
        <View style={styles.container}>
          {renderReact()}
          {data?.map?.(renderItem)}
        </View>
      }
    />
  );
};

const themeStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    list: {
      minWidth: 250,
    },
    reactContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.base,
    },
    itemMenu: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
    label: {
      marginStart: spacing.margin.large,
    },
    btnReact: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default React.forwardRef((props: Props, ref?: React.Ref<Props>) => (
  <MessageOptionsModal modalRef={ref} {...props} />
));
