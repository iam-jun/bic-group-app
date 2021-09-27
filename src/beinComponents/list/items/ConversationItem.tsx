import i18next from 'i18next';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import RedDot from '~/beinComponents/Badge/RedDot';
import Text from '~/beinComponents/Text';
import {roomTypes} from '~/constants/chat';
import {IConversation} from '~/interfaces/IChat';
import {getDefaultAvatar} from '~/screens/Chat/helper';
import {ITheme} from '~/theme/interfaces';
import {countTime, escapeMarkDown} from '~/utils/formatData';
import PrimaryItem from './PrimaryItem';

const ConversationItem: React.FC<IConversation> = ({
  name,
  lastMessage,
  avatar,
  _updatedAt,
  unreadCount,
  type,
}: IConversation): React.ReactElement => {
  const AVG_CHAR_ON_ONE_LINE = 32;
  let twoLineLastMessage = false;
  if (lastMessage && lastMessage.length >= AVG_CHAR_ON_ONE_LINE)
    twoLineLastMessage = true;

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, twoLineLastMessage);
  const {text, textSecondary} = theme.colors;
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(avatar);
  const textColor = unreadCount ? text : textSecondary;
  const isDirect = type === roomTypes.DIRECT;
  const welcomeText =
    type === 'direct'
      ? 'chat:label_init_direct_message:short'
      : 'chat:label_init_group_message:short';

  const onLoadAvatarError = () => {
    setAvatar(getDefaultAvatar(name));
  };

  const ItemAvatar = isDirect ? (
    <Avatar.Large
      style={styles.marginRight}
      source={avatar}
      placeholderSource={getDefaultAvatar(name)}
    />
  ) : (
    <Avatar.Group
      variant="large"
      style={styles.marginRight}
      source={_avatar}
      onError={onLoadAvatarError}
    />
  );

  return (
    <PrimaryItem
      title={name}
      titleProps={{
        numberOfLines: 1,
        color: textColor,
        style: styles.title,
      }}
      subTitleProps={{
        numberOfLines: 2,
        variant: unreadCount ? 'bodyM' : 'body',
        color: textColor,
      }}
      subTitle={escapeMarkDown(lastMessage) || i18next.t(welcomeText)}
      style={styles.container}
      LeftComponent={ItemAvatar}
      RightComponent={
        <View style={styles.rightComponent}>
          <Text.Subtitle
            style={styles.textUpdate}
            color={theme.colors.textSecondary}>
            {countTime(_updatedAt)}
          </Text.Subtitle>
          {unreadCount && (
            <RedDot style={styles.unreadBadge} number={unreadCount} />
          )}
        </View>
      }
    />
  );
};

const createStyles = (theme: ITheme, twoLineLastMessage: boolean) => {
  const {spacing} = theme;

  const defaultPaddingTop = spacing.padding.small || 8;
  const defaultPaddingBottom = spacing.padding.large || 16;
  const defaultHeight = 60 + defaultPaddingTop + defaultPaddingBottom;
  const unreadBadgeMarginTop = !twoLineLastMessage ? 0 : spacing.margin.base;

  return StyleSheet.create({
    container: {
      height: defaultHeight,
      paddingTop: defaultPaddingTop,
      paddingBottom: defaultPaddingBottom,
      marginHorizontal: spacing.margin.base,
      paddingHorizontal: spacing.padding.tiny,
      alignItems: 'flex-start',
    },
    title: {
      ...Platform.select({
        web: {
          paddingTop: 0,
        },
      }),
    },
    rightComponent: {
      marginLeft: spacing.margin.base,
      alignSelf: 'baseline',
      alignItems: 'flex-end',
    },
    marginRight: {
      marginRight: spacing.margin.base,
    },
    textUpdate: {
      paddingTop: 0,
    },
    unreadBadge: {
      marginTop: unreadBadgeMarginTop,
    },
  });
};

export default ConversationItem;
