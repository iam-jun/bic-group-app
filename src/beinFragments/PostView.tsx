import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button/';
import Divider from '~/beinComponents/Divider';
import FlashMessage from '~/beinComponents/FlashMessage';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {IPostActivity, IPostAudience} from '~/interfaces/IPost';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import menuActions from '~/screens/Menu/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';

export interface PostViewProps {
  postData: IPostActivity;
  onPressComment?: (data: IPostActivity) => void;
}

const PostView: FC<PostViewProps> = ({
  postData,
  onPressComment,
}: PostViewProps) => {
  const [isImportant, setIsImportant] = useState(false);
  const [calledMarkAsRead, setCalledMarkAsRead] = useState(false);

  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const {id, data, actor, audience, time, important, own_reactions} =
    postData || {};
  const {content} = data || {};

  const userId = useUserIdAuth();

  const avatar = actor?.data?.avatarUrl;
  const actorName = actor?.data?.fullname;
  const textAudiences = getAudiencesText(audience, t);
  const seenCount = '123.456';

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  /**
   * Check Important
   * - important active = true
   * - important expiresTime > now
   * - Not mark as read
   * - Not called mark as read
   */
  const checkImportant = () => {
    const {active = false, expiresTime} = important || {};
    let notExpired = false;
    let notMarkAsRead = true;

    if (expiresTime) {
      const now = new Date();
      notExpired = now.getTime() < new Date(expiresTime).getTime();
    }

    if (own_reactions?.mark_as_read?.length > 0) {
      notMarkAsRead = false;
    }

    setIsImportant(active && notExpired && notMarkAsRead);
  };

  useEffect(() => {
    if (important && important.active) {
      checkImportant();
    }
  }, [important]);

  const onPressActor = () => {
    dispatch(
      menuActions.selectUserProfile({
        id: actor?.id?.toString(),
        isPublic: true,
      }),
    );
    rootNavigation.navigate(menuStack.myProfile);
  };

  const onPressShowAudiences = () => {
    alert('onPressShowAudiences');
  };

  const onPressMentionAudience = (audience: any) => {
    if (audience) {
      alert(`Show profile of ${audience.name || audience.fullname}`);
    }
  };

  const onPressReact = () => {
    alert('onPressReact');
  };

  const onLongPressReact = () => {
    alert('onLongPressReact');
  };

  const _onPressComment = () => {
    onPressComment?.(postData);
  };

  const onPressMarkAsRead = () => {
    if (id) {
      postDataHelper
        .postMarkAsRead(id, userId)
        .then(response => {
          if (response && response?.data) {
            setCalledMarkAsRead(true);
          }
        })
        .catch(e => {
          console.log('\x1b[31m', '🐣️ onPressMarkAsRead |  : ', e, '\x1b[0m');
        });
    }
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

  const renderImportant = () => {
    if (!isImportant) {
      return null;
    }

    return (
      <FlashMessage
        textProps={{variant: 'h6'}}
        leftIcon={'InfoCircle'}
        type={'important'}>
        {t('common:text_important')}
      </FlashMessage>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{flexDirection: 'row', marginTop: spacing?.margin.small}}>
        <Avatar.UltraLarge source={avatar} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Button
            textProps={{
              variant: 'h6',
              style: {flex: 1, alignSelf: 'auto'},
            }}
            onPress={onPressActor}>
            {actorName}
          </Button>
          <View style={{flexDirection: 'row'}}>
            <Text.H6S
              useI18n
              color={colors.textSecondary}
              style={styles.textTo}>
              post:to
            </Text.H6S>
            <Button style={{flex: 1}} onPress={onPressShowAudiences}>
              <Text.H6>{textAudiences}</Text.H6>
            </Button>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
        <Button
          useI18n
          onPress={onPressReact}
          onLongPress={onLongPressReact}
          leftIcon={'iconReact'}
          leftIconProps={{
            icon: 'iconReact',
            size: 14,
            tintColor: colors.textSecondary,
          }}
          textProps={{
            variant: 'bodyM',
            color: colors.textSecondary,
          }}
          style={styles.buttonReact}>
          post:button_react
        </Button>
        <Divider style={{height: '66%', alignSelf: 'center'}} horizontal />
        <Button
          useI18n
          disabled={!onPressComment}
          onPress={_onPressComment}
          leftIcon={'CommentAltDots'}
          leftIconProps={{
            icon: 'CommentAltDots',
            size: 14,
            tintColor: colors.textSecondary,
          }}
          textProps={{
            variant: 'bodyM',
            color: colors.textSecondary,
          }}
          style={styles.buttonReact}>
          post:button_comment
        </Button>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text
          allowMarkdown
          onPressAudience={(audience: any) => onPressMentionAudience(audience)}>
          {content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImportant()}
      {renderHeader()}
      {renderContent()}
      {isImportant && (
        <Button.Secondary
          useI18n
          style={{margin: spacing.margin.base}}
          disabled={calledMarkAsRead}
          onPress={onPressMarkAsRead}>
          post:mark_as_read
        </Button.Secondary>
      )}
      {renderReactButtons()}
    </View>
  );
};

const getAudiencesText = (aud?: IPostAudience, t?: any) => {
  const limitLength = 25;
  let result = '';
  const {groups = [], users = []} = aud || {};
  const total = groups.length + users.length;
  result = groups?.[0]?.data?.name || users?.[0]?.data?.fullname || '';
  const left = total - 1;
  if (result?.length > limitLength) {
    result = `${result.substr(0, limitLength)}...`;
  } else if (left > 0) {
    result = `${result},...`;
  }
  if (left > 0) {
    result = `${result} +${left} ${t?.('post:other_places')}`;
  }
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
      borderBottomWidth: 1,
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
