import i18next from 'i18next';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import {roomTypes} from '~/constants/chat';
import {IConversation} from '~/interfaces/IChat';
import images from '~/resources/images';
import {getAvatar} from '~/screens/Chat/helper';
import {ITheme} from '~/theme/interfaces';
import {countTime} from '~/utils/formatData';
import PrimaryItem from './PrimaryItem';

const ConversationItem: React.FC<IConversation> = ({
  name,
  lastMessage,
  usernames,
  avatar,
  _updatedAt,
  unreadCount,
  type,
}: IConversation): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {text, textReversed, textSecondary} = theme.colors;
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(avatar);
  const textColor = unreadCount ? text : textSecondary;
  const isDirect = type === roomTypes.DIRECT;

  const onLoadAvatarError = () => {
    if (usernames) {
      const avatarGroup = usernames.map((username: string) =>
        getAvatar(username),
      );
      setAvatar(avatarGroup);
    } else setAvatar(images.img_group_avatar_default);
  };

  const ItemAvatar = isDirect ? (
    <Avatar.Large
      style={styles.marginRight}
      source={avatar}
      placeholderSource={images.img_user_avatar_default}
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
      subTitle={lastMessage || i18next.t('chat:label_init_group_message:short')}
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
            <View style={styles.unread}>
              <Text.ButtonSmall color={textReversed}>
                {unreadCount}
              </Text.ButtonSmall>
            </View>
          )}
        </View>
      }
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      height: 64, // = 60 + paddingBottom
      paddingBottom: spacing.margin.tiny,
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
    unread: {
      borderRadius: spacing?.borderRadius.large,
      width: spacing?.lineHeight.base,
      height: spacing?.lineHeight.base,
      marginTop: spacing?.margin.base,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default ConversationItem;
