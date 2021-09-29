import React, {useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';
import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import {IQuotedMessage} from '~/interfaces/IChat';
import {spacing} from '~/theme';
import {ITheme} from '~/theme/interfaces';
import {getAvatar} from '../helper';
import {useDispatch} from 'react-redux';
import actions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import images from '~/resources/images';

const QuotedMessage: React.FC<IQuotedMessage> = ({msgId, author}) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const message = useKeySelector(`chat.quotedMessages.${msgId}`);

  useEffect(() => {
    !message && dispatch(actions.getMessageDetail(msgId));
  }, [message]);

  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.connector} />
      <Text
        style={styles.right}
        numberOfLines={Platform.OS === 'web' ? 1 : 2}
        ellipsizeMode="tail">
        <Avatar.Tiny
          style={styles.avatar}
          source={getAvatar(author)}
          placeholderSource={images.img_user_avatar_default}
        />
        <Text.BodySM style={styles.textWrapper}>
          {`${message?.user?.name}  `}
        </Text.BodySM>
        <Text.BodyS style={styles.quote}>
          {message?.text ||
            ((message?.attachments || []).length > 0
              ? i18next.t('chat:label_replied_messsage_attachment')
              : '')}
        </Text.BodyS>
      </Text>
    </View>
  );
};
const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: spacing.margin.base,
    },
    connector: {
      height: Platform.OS === 'web' ? 18 : '80%',
      width: 20,
      marginLeft: 20,
      borderColor: colors.borderDisable,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopLeftRadius: spacing.borderRadius.small,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.tiny,
      marginLeft: spacing.margin.tiny,
      flexShrink: 1,
    },
    avatar: {
      marginLeft: spacing.margin.small,
      paddingTop: 2,
    },
    textWrapper: {
      marginLeft: spacing.margin.small,
      textTransform: 'capitalize',
    },
    text: {},
    quote: {
      color: colors.textSecondary,
      flexShrink: 1,
    },
  });
};

export default QuotedMessage;
