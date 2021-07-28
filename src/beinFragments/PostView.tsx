import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IPostActivity, IPostAudience} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import {formatDate} from '~/utils/formatData';
import Divider from '~/beinComponents/Divider';

export interface PostViewProps {
  postData: IPostActivity;
}

const PostView: React.FC<PostViewProps> = ({postData}: PostViewProps) => {
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const {data, actor, audience, time} = postData || {};
  const {content} = data || {};

  const avatar = 'https://i.ibb.co/DW2bMGR/pikachu.jpg';
  const actorName = `Gâu Gâu GẤU GẨU GẪU GẬU`;
  const textAudiences = getAudiencesText(audience);
  const seenCount = '123.456';

  const onPressActor = () => {
    alert('onPressActor id: ' + actor);
  };

  const onPressShowAudiences = () => {
    alert('onPressShowAudiences');
  };

  const onPressReact = () => {
    alert('onPressReact');
  };

  const onLongPressReact = () => {
    alert('onLongPressReact');
  };

  const onPressComment = () => {
    alert('onPressComment');
  };

  const renderPostTime = () => {
    if (!time) {
      return null;
    }
    let postTime = '';
    if (time) {
      const date = new Date(time);
      postTime = formatDate(date) || '';
    }
    return <Text.BodyS color={colors.textSecondary}>{postTime}</Text.BodyS>;
  };

  const renderHeader = () => {
    return (
      <View style={{flexDirection: 'row', marginTop: spacing?.margin.small}}>
        <Avatar.UltraLarge source={avatar} style={styles.avatar} />
        <View style={{flex: 1}}>
          <ButtonWrapper
            textProps={{
              variant: 'h6',
              style: {flex: 1, alignSelf: 'auto'},
            }}
            onPress={onPressActor}>
            {actorName}
          </ButtonWrapper>
          <View style={{flexDirection: 'row'}}>
            <Text.BodyS
              useI18n
              color={colors.textSecondary}
              style={styles.textTo}>
              post:to
            </Text.BodyS>
            <ButtonWrapper style={{flex: 1}} onPress={onPressShowAudiences}>
              <Text.H6>{textAudiences}</Text.H6>
            </ButtonWrapper>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderPostTime()}
            <Icon
              style={{margin: spacing?.margin.small}}
              size={3.2}
              icon={'iconDot'}
            />
            <Icon
              size={16}
              tintColor={colors.textSecondary}
              icon={'iconEyeSeen'}
            />
            <Text.BodyS color={colors.textSecondary}>{seenCount}</Text.BodyS>
          </View>
        </View>
        <View style={{marginRight: spacing?.margin.small}}>
          <Icon
            style={{alignSelf: 'auto'}}
            icon={'EllipsisH'}
            onPress={() => alert('onPress menu')}
          />
        </View>
      </View>
    );
  };

  const renderReactButtons = () => {
    return (
      <View style={styles.reactButtonContainer}>
        <ButtonWrapper
          onPress={onPressReact}
          onLongPress={onLongPressReact}
          leftIcon={'iconReact'}
          leftIconProps={{size: 14, tintColor: colors.textSecondary}}
          textProps={{
            variant: 'bodyM',
            color: colors.textSecondary,
          }}
          style={styles.buttonReact}>
          React
        </ButtonWrapper>
        <Divider style={{height: '66%', alignSelf: 'center'}} horizontal />
        <ButtonWrapper
          onPress={onPressComment}
          leftIcon={'CommentAltDots'}
          leftIconProps={{size: 14, tintColor: colors.textSecondary}}
          textProps={{
            variant: 'bodyM',
            color: colors.textSecondary,
          }}
          style={styles.buttonReact}>
          Comment
        </ButtonWrapper>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderReactButtons()}
    </View>
  );
};

const getAudiencesText = (aud?: IPostAudience) => {
  let result = '';
  const {groups = [], users = []} = aud || {};
  groups.map(
    item => (result = `${result}${result.length > 0 ? ', ' : ''}${item}`),
  );
  users.map(item => (result = `${result}, ${item}`));
  return result;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    avatar: {
      marginLeft: spacing?.margin.large,
      marginRight: spacing?.margin.base,
    },
    textTo: {
      marginRight: spacing?.margin.tiny,
      // fontFamily: fontFamilies.Poppins,
    },
    reactButtonContainer: {
      flexDirection: 'row',
      height: dimension?.commentBarHeight,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      alignItems: 'center',
    },
    contentContainer: {
      marginVertical: spacing?.margin.base,
      marginHorizontal: spacing?.margin.large,
    },
    buttonReact: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default PostView;
