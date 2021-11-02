import React, {useEffect} from 'react';
import {InteractionManager, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import ParseText from '~/beinComponents/Text/ParseText';
import {useKeySelector} from '~/hooks/selector';
import {IQuotedMessage} from '~/interfaces/IChat';
import modalActions from '~/store/modal/actions';
import {spacing} from '~/theme';
import {ITheme} from '~/theme/interfaces';
import {getAvatar, getDefaultAvatar} from '../../../helper';
import actions from '../../../redux/actions';
import LoadingQuotedMessage from './LoadingQuotedMessage';

interface Props {
  message: IQuotedMessage;
  onPress: () => void;
}

const _QuotedMessage: React.FC<Props> = ({message, onPress}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {author, msgId} = message || {};
  const _message = useKeySelector(`chat.quotedMessages.${msgId}`);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      !_message && dispatch(actions.getMessageDetail(msgId));
    });
  }, [_message]);

  if (!_message) return <LoadingQuotedMessage />;

  const onPressUser = (e: any) => {
    const payload = {
      userId: author,
      position: {x: e?.pageX, y: e?.pageY},
      params: {
        type: 'username',
      },
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  return (
    <ButtonWrapper contentStyle={styles.container} onPress={onPress}>
      <View style={styles.connector} />
      <Text
        style={styles.right}
        numberOfLines={Platform.OS === 'web' ? 1 : 2}
        ellipsizeMode="tail">
        <Text onPress={onPressUser}>
          <Avatar.Tiny
            style={styles.avatar}
            source={getAvatar(author)}
            placeholderSource={getDefaultAvatar(_message?.user?.name)}
          />
          <Text.BodySM style={styles.textWrapper}>
            {`${_message?.user?.name}  `}
          </Text.BodySM>
        </Text>
        {(_message?.attachments || []).length > 0 ? (
          <Text.BodyS useI18n style={styles.quote}>
            chat:label_replied_messsage_attachment
          </Text.BodyS>
        ) : (
          <ParseText style={styles.quote}>{_message?.text}</ParseText>
        )}
      </Text>
    </ButtonWrapper>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
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

const QuotedMessage = React.memo(_QuotedMessage);
QuotedMessage.whyDidYouRender = true;
export default QuotedMessage;
