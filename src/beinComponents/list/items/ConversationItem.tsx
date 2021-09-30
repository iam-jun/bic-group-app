import i18next from 'i18next';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import RedDot from '~/beinComponents/Badge/RedDot';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import {roomTypes} from '~/constants/chat';
import {IConversation} from '~/interfaces/IChat';
import {getDefaultAvatar} from '~/screens/Chat/helper';
import {ITheme} from '~/theme/interfaces';
import {countTime, escapeMarkDown} from '~/utils/formatData';

interface Props extends IConversation {
  total?: number;
  index?: number;
}

const ConversationItem: React.FC<Props> = ({
  name,
  lastMessage,
  avatar,
  _updatedAt,
  unreadCount,
  type,
  total,
  index,
}: Props): React.ReactElement => {
  const AVG_CHAR_ON_ONE_LINE = 32;
  let twoLineLastMessage = false;
  if (lastMessage && lastMessage.length >= AVG_CHAR_ON_ONE_LINE)
    twoLineLastMessage = true;

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, unreadCount > 0, twoLineLastMessage);
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(avatar);
  const isDirect = type === roomTypes.DIRECT;
  const welcomeText =
    type === 'direct'
      ? 'chat:label_init_direct_message:short'
      : 'chat:label_init_group_message:short';

  let showDivider = true;
  if (index && total && index + 1 === total) showDivider = false;

  const onLoadAvatarError = () => {
    setAvatar(getDefaultAvatar(name));
  };

  const ItemAvatar = isDirect ? (
    <Avatar.Large
      style={styles.avatar}
      source={avatar}
      placeholderSource={getDefaultAvatar(name)}
    />
  ) : (
    <Avatar.Group
      variant="large"
      style={styles.avatar}
      source={_avatar}
      onError={onLoadAvatarError}
    />
  );

  return (
    <Div className="chat__conversation-item">
      <View style={styles.container}>
        <View>{ItemAvatar}</View>
        <Div style={styles.contentContainer}>
          <View style={styles.header}>
            <Text.H6 style={styles.title} numberOfLines={1}>
              {name}
            </Text.H6>
            <Text.Subtitle
              style={styles.textUpdate}
              color={theme.colors.textSecondary}>
              {countTime(_updatedAt)}
            </Text.Subtitle>
          </View>
          <View style={styles.body}>
            <Text
              variant={unreadCount ? 'bodyM' : 'body'}
              numberOfLines={2}
              style={styles.lastMessage}>
              {escapeMarkDown(lastMessage) || i18next.t(welcomeText)}
            </Text>
            {!!unreadCount && (
              <RedDot style={styles.redDot} number={unreadCount} />
            )}
          </View>
          {showDivider && <Div style={styles.divider} />}
        </Div>
      </View>
    </Div>
  );
};

const createStyles = (
  theme: ITheme,
  unreadMessage: boolean,
  twoLineLastMessage: boolean,
) => {
  const {colors, spacing} = theme;
  const headerHeight = 20;
  const bodyHeight = 40;
  const dividerMarginTop = spacing.margin.small || 8;
  const dividerHeight = 1;
  const contentHeight =
    headerHeight + bodyHeight + dividerMarginTop + dividerHeight * 1.1;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      height: 84,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderRadius: 6,
    },
    avatar: {
      marginRight: spacing.margin.base,
    },
    contentContainer: {
      flex: 1,
      height: contentHeight,
      overflow: 'hidden',
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      height: '100%',
      maxHeight: headerHeight,
    },
    title: {
      flex: 1,
      height: 20,
      lineHeight: 20,
      ...Platform.select({
        web: {
          paddingTop: 0,
        },
      }),
    },
    textUpdate: {
      height: 20,
      lineHeight: 20,
    },
    body: {
      flex: 1,
      flexDirection: 'row',
      alignItems: twoLineLastMessage ? 'center' : 'flex-start',
      height: '100%',
      maxHeight: bodyHeight,
    },
    lastMessage: {
      flex: 1,
      height: bodyHeight,
      color: unreadMessage ? colors.textPrimary : colors.textSecondary,
    },
    redDot: {
      marginTop: spacing.margin.tiny,
      marginLeft: spacing.margin.base,
    },
    divider: {
      width: '100%',
      height: 1,
      marginTop: dividerMarginTop,
      backgroundColor: colors.borderDivider,
    },
  });
};

export default ConversationItem;
