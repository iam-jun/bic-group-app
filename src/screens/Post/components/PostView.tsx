import React, {FC, useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import moment from 'moment';

import {ITheme} from '~/theme/interfaces';
import {IPayloadReactToPost, IPostAudience} from '~/interfaces/IPost';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button/';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import menuActions from '~/screens/Menu/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {formatDate, formatLargeNumber} from '~/utils/formatData';
import ReactionView from '~/screens/Post/components/ReactionView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {ReactionType} from '~/constants/reactions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {IconType} from '~/resources/icons';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PostViewMenuBottomSheet from '~/screens/Post/components/PostViewMenuBottomSheet';
import MarkdownView from '~/beinComponents/MarkdownView';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import {AppContext} from '~/contexts/AppContext';
import {showReactionDetailBottomSheet} from '~/store/modal/actions';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';

export interface PostViewProps {
  postId: string;
  isPostDetail?: boolean;
  onPressComment?: (postId: string) => void;
  onPressHeader?: (postId: string) => void;
  hideMarkAsRead?: boolean;
}

const PostView: FC<PostViewProps> = ({
  postId,
  isPostDetail = false,
  onPressComment,
  onPressHeader,
  hideMarkAsRead = true,
}: PostViewProps) => {
  const [isImportant, setIsImportant] = useState(false);
  const [calledMarkAsRead, setCalledMarkAsRead] = useState(false);
  const menuSheetRef = useRef<any>();

  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const actor = useKeySelector(postKeySelector.postActorById(postId));
  const audience = useKeySelector(postKeySelector.postAudienceById(postId));
  const time = useKeySelector(postKeySelector.postTimeById(postId));
  const important = useKeySelector(postKeySelector.postImportantById(postId));
  const deleted = useKeySelector(postKeySelector.postDeletedById(postId));
  const own_reactions = useKeySelector(
    postKeySelector.postOwnReactionById(postId),
  );
  const reaction_counts = useKeySelector(
    postKeySelector.postReactionCountsById(postId),
  );
  const postObjectData = useKeySelector(
    postKeySelector.postObjectDataById(postId),
  );

  const {language} = useContext(AppContext);

  const {content} = postObjectData || {};

  const userId = useUserIdAuth();

  const avatar = actor?.data?.avatar;
  const actorName = actor?.data?.fullname;
  const textAudiences = getAudiencesText(audience, t);
  const seenCount = '123.456';

  const commentCount = formatLargeNumber(reaction_counts?.comment_count || 0);
  const labelButtonComment = `${t('post:button_comment')}${
    commentCount ? ` (${commentCount})` : ''
  }`;

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
    const {active = false} = important || {};
    let notMarkAsRead = true;
    // if (expiresTime) {
    //   const now = new Date();
    //   notExpired = now.getTime() < new Date(expiresTime).getTime();
    // }
    if (own_reactions?.mark_as_read?.length > 0) {
      notMarkAsRead = false;
    }
    setIsImportant(active && notMarkAsRead);
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
          isPublic: userId !== actor?.id,
        }),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    }
  };

  const onPressShowAudiences = () => {
    dispatch(
      postActions.showPostAudiencesBottomSheet({
        postId,
        fromStack: 'somewhere',
      }),
    );
  };

  const onPressMenu = (e: any) => {
    Keyboard.dismiss();
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
  };

  const onPressMentionAudience = (audience: any) => {
    if (audience?.id) {
      dispatch(
        menuActions.selectedProfile({
          id: audience?.id?.toString(),
          isPublic: userId !== audience?.id,
        }),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    }
  };

  const onPressReact = (event: any) => {
    dispatch(
      postActions.setShowReactionBottomSheet({
        show: true,
        title: t('post:label_all_reacts'),
        position: {x: event?.pageX, y: event?.pageY},
        callback: onAddReaction,
      }),
    );
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
      id: postId,
      reactionId: reactionId,
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.postReactToPost(payload));
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId: reactionId,
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.deleteReactToPost(payload));
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reaction_counts,
      postId: postId,
      commentId: undefined,
      initReaction: reactionType,
    };
    dispatch(showReactionDetailBottomSheet(payload));
  };

  const renderPostTime = () => {
    if (!time) {
      return null;
    }
    let postTime = '';
    if (time) {
      const dateUtc = moment.utc(time);
      const localDate = dateUtc.local();
      postTime = formatDate(localDate, undefined, language, 2, false) || '';
    }
    return <Text.BodyS color={colors.textSecondary}>{postTime}</Text.BodyS>;
  };

  const renderImportant = () => {
    if (!isImportant) {
      return null;
    }

    const expireTime = important?.expiresTime;
    if (expireTime) {
      const now = new Date();
      const notExpired = now.getTime() < new Date(expireTime).getTime();

      return <ImportantStatus notExpired={notExpired} />;
    }
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity
        disabled={!onPressHeader}
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
            {/*<Icon*/}
            {/*  style={{margin: spacing?.margin.small}}*/}
            {/*  size={3.2}*/}
            {/*  icon={'iconDot'}*/}
            {/*/>*/}
            {/*<Icon*/}
            {/*  size={16}*/}
            {/*  tintColor={colors.textSecondary}*/}
            {/*  icon={'iconEyeSeen'}*/}
            {/*/>*/}
            {/*<Text.BodyS color={colors.textSecondary}>{seenCount}</Text.BodyS>*/}
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
          <MarkdownView
            onPressAudience={(audience: any) =>
              onPressMentionAudience(audience)
            }>
            {content}
          </MarkdownView>
        ) : (
          <CollapsibleText
            content={content}
            limitLength={400}
            shortLength={400}
            useMarkdown
            toggleOnPress
            onPressAudience={(audience: any) =>
              onPressMentionAudience(audience)
            }
          />
        )}
      </View>
    );
  };

  if (deleted) {
    return (
      <View style={styles.deletedContainer}>
        <Image style={styles.imageDelete} source={images.img_delete} />
        <Text.H6 useI18n>post:label_post_deleted</Text.H6>
      </View>
    );
  }

  return (
    <View>
      {renderImportant()}
      <View
        style={[
          styles.container,
          Platform.OS === 'web' && !isPostDetail ? styles.containerWeb : {},
        ]}>
        {renderHeader()}
        {renderContent()}
        {!hideMarkAsRead && isImportant && (
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
          onLongPressReaction={onLongPressReaction}
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
            labelButtonComment,
            'CommentAltDots',
            _onPressComment,
            _onPressComment,
            !onPressComment,
          )}
        </View>
        <PostViewMenuBottomSheet
          modalizeRef={menuSheetRef}
          postId={postId}
          content={content}
          isPostDetail={isPostDetail}
          isActor={actor?.id == userId}
        />
      </View>
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
    containerWeb: {
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: colors.borderDivider,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#120F22',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    deletedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.background,
    },
    imageDelete: {width: 35, height: 35, marginRight: spacing.margin.large},
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
