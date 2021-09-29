import React, {FC, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Keyboard, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {IPayloadReactToPost} from '~/interfaces/IPost';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button/';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {formatLargeNumber} from '~/utils/formatData';
import ReactionView from '~/screens/Post/components/ReactionView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {ReactionType} from '~/constants/reactions';
import PostViewMenuBottomSheet from '~/screens/Post/components/PostViewMenuBottomSheet';
import {showReactionDetailBottomSheet} from '~/store/modal/actions';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import PostViewContent from '~/screens/Post/components/postView/PostViewContent';
import PostViewHeader from '~/screens/Post/components/postView/PostViewHeader';
import PostViewImportant from '~/screens/Post/components/postView/PostViewImportant';
import PostViewFooter from '~/screens/Post/components/postView/PostViewFooter';

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

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
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

  const {content, images} = postObjectData || {};

  const userId = useUserIdAuth();

  const commentCount = formatLargeNumber(reaction_counts?.comment_count || 0);
  const labelButtonComment = `${t('post:button_comment')}${
    commentCount ? ` (${commentCount})` : ''
  }`;

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

  const onPressShowAudiences = () => {
    const payload = {postId, fromStack: 'somewhere'};
    dispatch(postActions.showPostAudiencesBottomSheet(payload));
  };

  const onPressMenu = (e: any) => {
    Keyboard.dismiss();
    menuSheetRef.current?.open?.(e?.pageX, e?.pageY);
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
      <PostViewImportant
        isImportant={isImportant}
        expireTime={important?.expiresTime}
      />
      <View
        style={[
          styles.container,
          Platform.OS === 'web' && !isPostDetail ? styles.containerWeb : {},
        ]}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          time={time}
          onPressHeader={() => onPressHeader?.(postId)}
          onPressMenu={onPressMenu}
          onPressShowAudiences={onPressShowAudiences}
        />
        <PostViewContent
          content={content}
          images={images}
          isPostDetail={isPostDetail}
        />
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
        <PostViewFooter
          labelButtonComment={labelButtonComment}
          onAddReaction={onAddReaction}
          onPressComment={() => onPressComment?.(postId)}
        />
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

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
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
  });
};

export default PostView;
