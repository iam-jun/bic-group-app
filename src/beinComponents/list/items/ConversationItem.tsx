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
}: IConversation): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const [_avatar, setAvatar] = useState<string | string[] | undefined>(avatar);

  const onLoadAvatarError = () => {
    if (usernames)
      setAvatar(usernames.map((username: string) => getAvatar(username)));
    else setAvatar(images.img_group_avatar_default);
  };

  return (
    <PrimaryItem
      title={name}
      subTitle={lastMessage}
      LeftComponent={
        <Avatar.Group
          style={styles.marginRight}
          source={_avatar}
          onError={onLoadAvatarError}
        />
      }
      RightComponent={
        <View style={styles.marginLeft}>
          <Text.H6 color={theme.colors.textSecondary}>
            {countTime(_updatedAt)}
          </Text.H6>
        </View>
      }
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    marginLeft: {
      marginLeft: spacing.margin.base,
    },
    marginRight: {
      marginRight: spacing.margin.base,
    },
  });
};

export default ConversationItem;
