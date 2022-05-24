import React, {FC, useContext, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import {AppContext} from '~/contexts/AppContext';
import {useRootNavigation} from '~/hooks/navigation';

import {
  IPayloadGetDraftPosts,
  IPayloadPublishDraftPost,
  IPostActivity,
} from '~/interfaces/IPost';
import PostViewHeader from '~/screens/Post/components/postView/PostViewHeader';
import PostViewContent from '~/screens/Post/components/postView/PostViewContent';
import PostViewImportant from '~/screens/Post/components/postView/PostViewImportant';
import Button from '~/beinComponents/Button';
import modalActions, {showHideToastMessage} from '~/store/modal/actions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

export interface PostViewDraftProps {
  style?: StyleProp<ViewStyle>;
  data: IPostActivity;
  isPostDetail?: boolean;
}

const PostViewDraft: FC<PostViewDraftProps> = ({
  style,
  data,
  isPostDetail = false,
}: PostViewDraftProps) => {
  const [publishing, setPublishing] = useState(false);

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const {id, actor, audience, media, content, setting, isDraft} = data || {};

  const {images} = media || {};
  const {isImportant, importantExpiredAt} = setting || {};

  const disableButtonPost =
    publishing ||
    !content ||
    (audience?.groups?.length === 0 && audience?.users?.length === 0);

  const showError = (e: any) => {
    dispatch(
      showHideToastMessage({
        content:
          e?.meta?.message ||
          e?.meta?.errors?.[0]?.message ||
          'common:text_error_message',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  };

  const refreshDraftPosts = () => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = {isRefresh: true};
      dispatch(postActions.getDraftPosts(payload));
    }
  };

  const onPressPost = () => {
    if (id) {
      setPublishing(true);
      const payload: IPayloadPublishDraftPost = {
        draftPostId: id,
        onSuccess: () => {
          dispatch(
            showHideToastMessage({
              content: 'post:draft:text_draft_published',
              props: {textProps: {useI18n: true}, type: 'success'},
            }),
          );
          refreshDraftPosts();
        },
        onError: () => setPublishing(false),
      };
      dispatch(postActions.postPublishDraftPost(payload));
    }
  };

  const onPressEdit = () => {
    rootNavigation.navigate(homeStack.createPost, {
      draftPostId: id,
      replaceWithDetail: !isPostDetail,
    });
  };

  const onDelete = () => {
    dispatch(modalActions.hideModal());
    if (id) {
      postDataHelper
        .deletePost(id, isDraft)
        .then(response => {
          if (response?.data) {
            dispatch(
              showHideToastMessage({
                content: 'post:draft:text_draft_deleted',
                props: {textProps: {useI18n: true}, type: 'success'},
              }),
            );
            refreshDraftPosts();
          }
        })
        .catch(e => {
          showError(e);
        });
    }
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideModal());
    dispatch(
      modalActions.showAlert({
        title: t('post:draft:title_delete_draft_post'),
        content: t('post:draft:text_delete_draft_post'),
        showCloseButton: true,
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_delete'),
        onConfirm: onDelete,
        stretchOnWeb: true,
      }),
    );
  };

  const onPressCalendar = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressMenu = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <View>
            <PrimaryItem
              height={48}
              leftIconProps={{icon: 'CalendarAlt', size: 20}}
              leftIcon={'CalendarAlt'}
              title={t('post:draft:btn_menu_schedule')}
              onPress={onPressCalendar}
            />
            <PrimaryItem
              height={48}
              leftIconProps={{icon: 'TrashAlt', size: 20}}
              leftIcon={'TrashAlt'}
              title={t('post:draft:btn_menu_delete')}
              onPress={onPressDelete}
            />
          </View>
        ),
        props: {webModalStyle: {minHeight: undefined}},
      }),
    );
  };

  return (
    <View>
      <PostViewImportant
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
      />
      <View
        style={StyleSheet.flatten([
          styles.container,
          Platform.OS === 'web' && !isPostDetail ? styles.containerWeb : {},
          style,
        ])}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          onPressMenu={onPressMenu}
          // onPressHeader={() => onPressHeader?.(postId)}
          // onPressShowAudiences={onPressShowAudiences}
        />
        <PostViewContent
          postId={id || ''}
          content={content}
          images={images}
          isPostDetail={isPostDetail}
        />
        <View style={styles.footerButtonContainer}>
          <Button.Secondary
            loading={publishing}
            disabled={disableButtonPost}
            style={styles.footerButton}
            onPress={onPressPost}>
            {t('post:draft:btn_post_now')}
          </Button.Secondary>
          <Button.Secondary style={styles.footerButton} onPress={onPressEdit}>
            {t('post:draft:btn_edit')}
          </Button.Secondary>
        </View>
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
    footerButtonContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.tiny,
    },
    footerButton: {
      flex: 1,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default PostViewDraft;
