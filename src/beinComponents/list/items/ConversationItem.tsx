import i18next from 'i18next';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import RedDot from '~/beinComponents/Badge/RedDot';
import Div from '~/beinComponents/Div';
import Text from '~/beinComponents/Text';
import {IConversation} from '~/interfaces/IChat';
import {getDefaultAvatar} from '~/screens/Chat/helper';
import {ITheme} from '~/theme/interfaces';
import {countTime, escapeMarkDown} from '~/utils/formatData';

interface Props extends IConversation {
  total?: number;
  index?: number;
  isActive?: boolean;
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
  isActive = false,
}: Props): React.ReactElement => {
  const AVG_CHAR_ON_ONE_LINE = 32;
  let twoLineLastMessage = false;
  if (lastMessage && lastMessage.length >= AVG_CHAR_ON_ONE_LINE)
    twoLineLastMessage = true;

  const theme = useTheme() as ITheme;
  const styles = createStyles(
    theme,
    unreadCount > 0,
    twoLineLastMessage,
    isActive,
  );
  const welcomeText =
    type === 'direct'
      ? 'chat:label_init_direct_message:short'
      : 'chat:label_init_group_message:short';

  let showDivider = true;
  if (index && total && index + 1 === total) showDivider = false;

  let className = 'chat__conversation-item';
  if (isActive) className = className + ` ${className}--active`;

  const ItemAvatar = (
    <Avatar.Large
      style={styles.avatar}
      source={avatar}
      cache={false}
      placeholderSource={getDefaultAvatar(name)}
    />
  );

  return (
    <Div className={className}>
      {Platform.OS === 'web' && isActive && (
        <View style={styles.itemActiveIndicator} />
      )}
      <View style={styles.container}>
        {ItemAvatar}
        <Div
          style={[
            styles.contentContainer,
            showDivider ? styles.bottomDivider : {},
          ]}>
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
              <RedDot
                style={styles.redDot}
                number={unreadCount}
                maxNumber={99}
              />
            )}
          </View>
        </Div>
      </View>
    </Div>
  );
};

const createStyles = (
  theme: ITheme,
  unreadMessage: boolean,
  twoLineLastMessage: boolean,
  isActive: boolean,
) => {
  const {colors, spacing} = theme;
  const isWeb = Platform.OS === 'web';

  const contentHeight = 72;
  const headerHeight = 20;
  const messageHeight = 40;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      height: 88,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderRadius: spacing.borderRadius.small,
    },
    itemActiveIndicator: {
      position: 'absolute',
      top: '24%',
      width: 4,
      height: 48,
      backgroundColor: colors.primary5,
      borderTopRightRadius: spacing.borderRadius.small,
      borderBottomRightRadius: spacing.borderRadius.small,
    },
    avatar: {
      alignSelf: isActive ? 'center' : 'flex-start',
      marginTop: 0,
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
      flexDirection: 'row',
      alignItems: twoLineLastMessage ? 'center' : 'flex-start',
    },
    bottomDivider: {
      borderBottomColor: colors.borderDivider,
      borderBottomWidth: 1,
    },
    lastMessage: {
      flex: 1,
      height: messageHeight,
      lineHeight: 20,
      color: unreadMessage ? colors.textPrimary : colors.textSecondary,
    },
    redDot: {
      marginTop: !isWeb ? spacing.margin.tiny : 0,
      marginLeft: spacing.margin.base,
    },
  });
};

export default ConversationItem;
