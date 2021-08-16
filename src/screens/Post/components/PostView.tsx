import React, {FC, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import moment from 'moment';

import {ITheme} from '~/theme/interfaces';
import {IPayloadReactToPost, IPostAudience} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button/';
import Divider from '~/beinComponents/Divider';
import FlashMessage from '~/beinComponents/FlashMessage';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import menuActions from '~/screens/Menu/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {formatDate} from '~/utils/formatData';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import ReactionView from '~/screens/Post/components/ReactionView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {ReactionType} from '~/constants/reactions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {IconType} from '~/resources/icons';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PostViewMenuBottomSheet from '~/screens/Post/components/PostViewMenuBottomSheet';

export interface PostViewProps {
  postId: string;
  isPostDetail?: boolean;
  onPressComment?: (postId: string) => void;
  onPressHeader?: (postId: string) => void;
}

const PostView: FC<PostViewProps> = ({
  postId,
  isPostDetail,
  onPressComment,
  onPressHeader,
}: PostViewProps) => {
  const [isImportant, setIsImportant] = useState(false);
  const [calledMarkAsRead, setCalledMarkAsRead] = useState(false);
  const reactionSheetRef = useRef<any>();
  const menuSheetRef = useRef<any>();

  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const actor = useKeySelector(postKeySelector.postActorById(postId));
  const audience = useKeySelector(postKeySelector.postAudienceById(postId));
  const time = useKeySelector(postKeySelector.postTimeById(postId));
  const important = useKeySelector(postKeySelector.postImportantById(postId));
  const own_reactions = useKeySelector(
    postKeySelector.postOwnReactionById(postId),
  );
  const reaction_counts = useKeySelector(
    postKeySelector.postReactionCountsById(postId),
  );
  const postObjectData = useKeySelector(
    postKeySelector.postObjectDataById(postId),
  );

  const {content} = postObjectData || {};

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
    if (actor?.id) {
      dispatch(
        menuActions.selectedProfile({
          id: actor?.id?.toString(),
          isPublic: true,
        }),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    }
  };

  const onPressShowAudiences = () => {
    alert('onPressShowAudiences');
  };

  const onPressMenu = () => {
    menuSheetRef.current?.open?.();
  };

  const onPressMentionAudience = (audience: any) => {
    if (audience) {
      alert(`Show profile of ${audience.name || audience.fullname}`);
    }
  };

  const onPressReact = () => {
    reactionSheetRef?.current?.open?.();
  };

  const _onPressComment = () => {
    onPressComment?.(postId);
  };

  const onPressMarkAsRead = () => {
    if (postId) {
      postDataHelper
        .postMarkAsRead(postId, userId)
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

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      postId,
      reactionId: reactionId,
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.postReactToPost(payload));
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      postId,
      reactionId: reactionId,
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.deleteReactToPost(payload));
  };

  const renderPostTime = () => {
    if (!time) {
      return null;
    }
    let postTime = '';
    if (time) {
      const dateUtc = moment.utc(time);
      const localDate = dateUtc.local();
      postTime = formatDate(localDate) || '';
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
      <TouchableOpacity
        onPress={() => onPressHeader?.(postId)}
        style={styles.headerContainer}>
        <Avatar.UltraLarge source={avatar} style={styles.avatar} />
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={onPressActor}
            style={{alignSelf: 'flex-start'}}>
            <Text.H6>{actorName}</Text.H6>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text.H6S
              useI18n
              color={colors.textSecondary}
              style={styles.textTo}>
              post:to
            </Text.H6S>
            <Text.H6 onPress={onPressShowAudiences}>{textAudiences}</Text.H6>
          </View>
          <View style={styles.rowCenter}>
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
            onPress={onPressMenu}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderReactButtonItem = (
    title: string,
    icon: IconType,
    onPress: any,
    onLongPress: any,
    disabled?: boolean,
  ) => {
    return (
      <Button
        useI18n
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        leftIcon={icon}
        leftIconProps={{
          icon: icon,
          size: 14,
          tintColor: colors.textSecondary,
        }}
        textProps={{
          variant: 'bodyM',
          color: colors.textSecondary,
        }}
        style={styles.buttonReact}>
        {title}
      </Button>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {isPostDetail ? (
          <Text
            allowMarkdown
            onPressAudience={(audience: any) =>
              onPressMentionAudience(audience)
            }>
            {content}
          </Text>
        ) : (
          <CollapsibleText
            content={content}
            limitLength={400}
            shortLength={400}
            allowMarkdown
            toggleOnPress
            onPressAudience={(audience: any) =>
              onPressMentionAudience(audience)
            }
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImportant()}
      {renderHeader()}
      {renderContent()}
      {isImportant && (
        <View>
          <Button.Secondary
            useI18n
            style={{margin: spacing.margin.base}}
            disabled={calledMarkAsRead}
            onPress={onPressMarkAsRead}>
            {calledMarkAsRead ? 'post:marked_as_read' : 'post:mark_as_read'}
          </Button.Secondary>
          <Divider />
        </View>
      )}
      <ReactionView
        ownReactions={own_reactions}
        reactionCounts={reaction_counts}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
      />
      <View style={styles.reactButtonContainer}>
        {renderReactButtonItem(
          'post:button_react',
          'iconReact',
          onPressReact,
          onPressReact,
        )}
        <Divider style={{height: '66%', alignSelf: 'center'}} horizontal />
        {renderReactButtonItem(
          'post:button_comment',
          'CommentAltDots',
          _onPressComment,
          _onPressComment,
          !onPressComment,
        )}
      </View>
      <ReactionBottomSheet
        reactionSheetRef={reactionSheetRef}
        onPressReaction={onAddReaction}
        title={t('post:label_all_reacts')}
      />
      <PostViewMenuBottomSheet
        modalizeRef={menuSheetRef}
        postId={postId}
        isActor={actor.id == userId}
      />
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
    rowCenter: {flexDirection: 'row', alignItems: 'center'},
    container: {
      backgroundColor: colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      paddingTop: spacing?.margin.small,
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
      marginVertical: spacing?.margin.small,
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
