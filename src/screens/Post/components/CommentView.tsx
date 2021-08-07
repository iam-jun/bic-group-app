import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {countTime} from '~/utils/formatData';
import Icon from '~/beinComponents/Icon';
import i18next from 'i18next';

export interface CommentViewProps {
  commentData: IReaction;
  onPressReply: (data: IReaction) => void;
  contentBackgroundColor?: string;
}

const CommentView: React.FC<CommentViewProps> = ({
  commentData,
  onPressReply,
  contentBackgroundColor,
}: CommentViewProps) => {
  const [contentShowAll, setContentShowAll] = useState(false);
  const [shortDescription, shortContent] = useState('');

  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {data, created_at, user} = commentData || {};
  const {content} = data || {};
  const avatar = user?.data?.avatarUrl || '';
  const name = user?.data?.fullname || '';

  let postTime = '';
  if (created_at) {
    postTime = countTime(created_at);
  }

  useEffect(() => {
    if (content && content?.length > 400) {
      shortContent(`${content.substr(0, 100)}...`);
    }
  }, []);

  const onPressUser = () => {
    alert('onPressUser: ' + user?.id);
  };

  const onPressReact = () => {
    alert('onPressReact');
  };

  const onLongPressReact = () => {
    alert('onLongPressReact');
  };

  const _onPressReply = () => {
    console.log('\x1b[31m', '🐣️  | _onPressReply : ', '\x1b[0m');
    onPressReply?.(commentData);
  };

  return (
    <View>
      <View style={styles.container}>
        <Avatar source={avatar} />
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <View
            style={StyleSheet.flatten([
              styles.contentContainer,
              contentBackgroundColor
                ? {backgroundColor: contentBackgroundColor}
                : {},
            ])}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <ButtonWrapper
                  style={{alignSelf: 'flex-start'}}
                  onPress={onPressUser}>
                  <Text.H6>{name}</Text.H6>
                </ButtonWrapper>
              </View>
              <Text.Subtitle color={colors.textSecondary}>
                {postTime}
              </Text.Subtitle>
            </View>
            <Text>{content}</Text>
            <Text>
              <Text.BodyS>
                {contentShowAll ? content : shortDescription}
              </Text.BodyS>
              {shortDescription && (
                <Text.ButtonSmall
                  onPress={() => setContentShowAll(!contentShowAll)}
                  color={colors.textInfo}>
                  {` ${
                    contentShowAll
                      ? i18next.t('common:text_show_less')
                      : i18next.t('common:text_read_more')
                  }`}
                </Text.ButtonSmall>
              )}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonWrapper
              style={styles.buttonReact}
              onPress={onPressReact}
              onLongPress={onLongPressReact}>
              <Icon size={14} icon={'iconReact'} />
            </ButtonWrapper>
            <ButtonWrapper onPress={_onPressReply}>
              <Text.ButtonSmall
                style={styles.buttonReply}
                color={colors.textSecondary}>
                Reply
              </Text.ButtonSmall>
            </ButtonWrapper>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 1,
      paddingTop: spacing?.padding.tiny,
      paddingBottom: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.small,
      backgroundColor: colors.surface,
      borderRadius: spacing?.borderRadius.small,
    },
    buttonReact: {
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: spacing?.borderRadius.small,
      padding: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      // marginTop: spacing?.margin.tiny,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonReply: {
      marginRight: spacing?.margin.tiny,
      marginVertical: spacing?.margin.base,
    },
  });
};

export default CommentView;
