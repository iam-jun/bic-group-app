import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {formatDate} from '~/utils/formatData';
import Icon from '~/beinComponents/Icon';

export interface CommentViewProps {
  commentData: IReaction;
}

const CommentView: React.FC<CommentViewProps> = ({
  commentData,
}: CommentViewProps) => {
  const theme: ITheme = useTheme();
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {data, created_at, user} = commentData || {};
  const {content} = data || {};
  const avatar = user?.data?.avatarUrl || '';
  const name = user?.data?.fullname || '';

  let postTime = '';
  if (created_at) {
    const date = new Date(created_at);
    postTime = formatDate(date) || '';
  }

  const onPressUser = () => {
    alert('onPressUser: ' + user?.id);
  };

  const onPressReact = () => {
    alert('onPressReact');
  };

  const onLongPressReact = () => {
    alert('onLongPressReact');
  };

  const onPressReply = () => {
    alert('onPressReply');
  };

  return (
    <View>
      <View style={styles.container}>
        <Avatar source={avatar} />
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <View style={styles.contentContainer}>
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
          </View>
          <View style={styles.buttonContainer}>
            <ButtonWrapper
              style={styles.buttonReact}
              onPress={onPressReact}
              onLongPress={onLongPressReact}>
              <Icon size={14} icon={'iconReact'} />
            </ButtonWrapper>
            <ButtonWrapper>
              <Text.ButtonSmall
                style={{marginRight: spacing?.margin.tiny}}
                color={colors.textSecondary}
                onPress={onPressReply}>
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
      marginTop: spacing?.margin.tiny,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
};

export default CommentView;
