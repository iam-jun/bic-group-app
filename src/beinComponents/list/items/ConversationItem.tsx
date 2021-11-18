import i18next from 'i18next';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Avatar from '~/beinComponents/Avatar';
import Div from '~/beinComponents/Div';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {roomTypes} from '~/constants/chat';
import {IConversation} from '~/interfaces/IChat';
import ConversationItemMenu from '~/screens/Chat/components/ConversationItemMenu';
import modalActions from '~/store/modal/actions';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import {escapeMarkDown} from '~/utils/formatData';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import TimeView from '~/beinComponents/TimeView';
import useAuth from '~/hooks/auth';
import {getLastMessage} from '~/screens/Chat/helper';

interface Props extends IConversation {
  total?: number;
  index?: number;
  isActive?: boolean;
}

const ConversationItem: React.FC<Props> = ({
  _id,
  name,
  lastMessage,
  avatar,
  _updatedAt,
  unreadCount,
  type,
  total,
  index,
  isActive = false,
  disableNotifications,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const {user} = useAuth();
  const lastMessageText = getLastMessage(lastMessage, user);
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, unreadCount > 0, isActive);
  const welcomeText =
    type === 'direct'
      ? 'chat:label_init_direct_message:short'
      : 'chat:label_init_group_message:short';

  let showDivider = true;
  if (index && total && index + 1 === total) showDivider = false;

  let className = 'chat__conversation-item';
  if (isActive) className = className + ` ${className}--active`;

  const onPressMenu = (event: any) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <ConversationItemMenu
            conversationId={_id}
            disableNotifications={disableNotifications}
          />
        ),
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
          position: {x: event?.pageX, y: event?.pageY},
        },
      }),
    );
  };

  const ItemAvatar = (
    <Avatar.Large
      style={styles.avatar}
      source={avatar}
      cache={false}
      placeholderSource={
        type === roomTypes.DIRECT
          ? images.img_user_avatar_default
          : images.img_group_avatar_default
      }
    />
  );

  const renderMuteIndicator = () => {
    if (!disableNotifications) return null;

    return (
      <Icon
        icon={'BellSlash'}
        size={14}
        tintColor={theme.colors.textSecondary}
        style={styles.muteIndicator}
      />
    );
  };

  const renderNotificationsBadge = () => {
    if (!unreadCount) return null;

    const variant = disableNotifications ? 'default' : 'alert';
    return (
      <NotificationsBadge
        style={styles.badge}
        number={unreadCount}
        maxNumber={99}
        variant={variant}
      />
    );
  };

  const renderMenuButton = () => {
    if (Platform.OS !== 'web') return null;

    return (
      <Div className="chat__conversation-item__menu">
        <View style={styles.menuButton}>
          <Icon
            style={{alignSelf: 'auto'}}
            icon={'EllipsisH'}
            onPress={onPressMenu}
          />
        </View>
      </Div>
    );
  };

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
            {renderMuteIndicator()}
            <TimeView
              style={styles.textUpdate}
              time={_updatedAt}
              type={'short'}
            />
          </View>
          <View style={styles.body}>
            <Text
              variant={unreadCount && !disableNotifications ? 'bodyM' : 'body'}
              numberOfLines={2}
              style={styles.lastMessage}>
              {escapeMarkDown(lastMessageText) || i18next.t(welcomeText)}
            </Text>
            <View style={styles.optionsContainer}>
              {renderNotificationsBadge()}
              {renderMenuButton()}
            </View>
          </View>
        </Div>
      </View>
    </Div>
  );
};

const createStyles = (
  theme: ITheme,
  unreadMessage: boolean,
  isActive: boolean,
) => {
  const {colors, spacing} = theme;

  const contentHeight = 72;
  const headerHeight = 22;
  const messageMaxHeight = 42;

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
      lineHeight: 20,
      ...Platform.select({
        web: {
          paddingTop: 0,
        },
      }),
    },
    muteIndicator: {
      marginTop: 2,
      marginRight: spacing.margin.tiny,
    },
    textUpdate: {
      height: 20,
      lineHeight: 20,
    },
    body: {
      flexDirection: 'row',
    },
    bottomDivider: {
      borderBottomColor: colors.borderDivider,
      borderBottomWidth: 1,
    },
    lastMessage: {
      flex: 1,
      maxHeight: messageMaxHeight,
      lineHeight: 20,
      color: unreadMessage ? colors.textPrimary : colors.textSecondary,
    },
    optionsContainer: {
      flexDirection: 'column',
      marginRight: 1, // just to avoid it being hidden on web
    },
    badge: {
      marginLeft: spacing.margin.base,
    },
    menuButton: {
      width: 20,
      height: 20,
      marginTop: spacing.margin.tiny,
      marginLeft: spacing.margin.base,
    },
  });
};

export default ConversationItem;
