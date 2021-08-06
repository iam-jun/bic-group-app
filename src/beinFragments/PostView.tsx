import React, {FC, useState, useEffect, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {IPostActivity, IPostAudience} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button/';
import Icon from '~/beinComponents/Icon';
import {formatDate} from '~/utils/formatData';
import Divider from '~/beinComponents/Divider';
import FlashMessage from '~/beinComponents/FlashMessage';
import {useBaseHook} from '~/hooks';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {useUserIdAuth} from '~/hooks/auth';
import {useDispatch} from 'react-redux';
import {AppContext} from '~/contexts/AppContext';
import homeActions from '~/screens/Home/redux/actions';

export interface PostViewProps {
  postData: IPostActivity;
}

const PostView: FC<PostViewProps> = ({postData}: PostViewProps) => {
  const [isImportant, setIsImportant] = useState(false);
  const [calledMarkAsRead, setCalledMarkAsRead] = useState(false);

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const {id, data, actor, audience, time, important, own_reactions} =
    postData || {};
  const {content} = data || {};

  const userId = useUserIdAuth();
  const {streamClient} = useContext(AppContext);

  const avatar = actor?.data?.avatarUrl;
  const actorName = actor?.data?.fullname;
  const textAudiences = getAudiencesText(audience);
  const seenCount = '123.456';

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

  const onPressMarkAsRead = () => {
    if (id) {
      postDataHelper
        .postMarkAsRead(id, userId)
        .then(response => {
          if (response && response?.data) {
            setCalledMarkAsRead(true);
            dispatch(
              homeActions.getHomePosts({
                streamClient,
                userId: userId.toString(),
              }),
            );
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
          React
        </Button>
        <Divider style={{height: '66%', alignSelf: 'center'}} horizontal />
        <Button
          onPress={onPressComment}
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
          Comment
        </Button>
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

const getAudiencesText = (aud?: IPostAudience) => {
  let result = '';
  const {groups = [], users = []} = aud || {};
  groups.map(
    (item: any) =>
      (result = `${result}${result.length > 0 ? ', ' : ''}${item?.data?.name}`),
  );
  users.map((item: any) => (result = `${result}, ${item?.data?.fullname}`));
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
