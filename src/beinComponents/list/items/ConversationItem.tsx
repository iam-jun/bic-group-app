import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
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
}: IConversation): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {text, textReversed, textSecondary} = theme.colors;
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(avatar);
  const textcolor = unreadCount ? text : textSecondary;

  const onLoadAvatarError = () => {
    if (usernames)
      setAvatar(usernames.map((username: string) => getAvatar(username)));
    else setAvatar(images.img_group_avatar_default);
  };

  return (
    <PrimaryItem
      title={name}
      titleProps={{
        color: textcolor,
      }}
      subTitleProps={{
        variant: unreadCount ? 'bodyM' : 'body',
        color: textcolor,
      }}
      subTitle={lastMessage}
      LeftComponent={
        <Avatar.Group
          variant="large"
          style={styles.marginRight}
          source={_avatar}
          onError={onLoadAvatarError}
        />
      }
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
