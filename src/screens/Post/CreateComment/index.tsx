import React, {FC, useState, useEffect} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useBaseHook} from '~/hooks';
import postActions from '~/screens/Post/redux/actions';
import {IActivityData, IReaction} from '~/interfaces/IPost';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostInput from '~/beinComponents/inputs/PostInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import i18n from '~/localization';

export interface CreateCommentProps {
  route?: {
    params?: {
      commentId?: string;
      groupIds?: string;
    };
  };
}

const CreateComment: FC<CreateCommentProps> = ({route}: CreateCommentProps) => {
  const {commentId, groupIds} = route?.params || {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const comment: IReaction =
    useKeySelector(postKeySelector.commentById(commentId)) || {};
  const oldContent = comment?.data?.content;

  const loading = useKeySelector(postKeySelector.createComment.loading);
  const content = useKeySelector(postKeySelector.createComment.content);

  const isEditHasChange = content !== oldContent;
  const disableButton = content === oldContent || loading;

  useEffect(() => {
    if (oldContent) {
      dispatch(postActions.setCreateComment({content: oldContent}));
    }
  }, [oldContent]);

  const onPressComment = () => {
    Keyboard.dismiss();
    if (commentId && comment) {
      const newData: IActivityData = {};
      newData.content = content;
      dispatch(
        postActions.putEditComment({
          id: commentId,
          comment: comment,
          data: newData,
        }),
      );
    }
  };

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreateComment({content: text}));
  };

  const onPressBack = () => {
    Keyboard.dismiss();

    if (isEditHasChange) {
      dispatch(
        modalActions.showAlert({
          title: i18n.t('common:label_discard_changes'),
          content: i18n.t('common:text_discard_warning'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: i18n.t('common:btn_continue_editing'),
          confirmLabel: i18n.t('common:btn_discard'),
          onConfirm: () => rootNavigation.goBack(),
          stretchOnWeb: true,
        }),
      );
      return;
    }
    rootNavigation.goBack();
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_edit_comment'}
        buttonText={'common:btn_save'}
        buttonProps={{
          loading: loading,
          disabled: disableButton,
          color: colors.primary7,
          textColor: colors.textReversed,
          useI18n: true,
        }}
        onPressBack={onPressBack}
        onPressButton={onPressComment}
      />
      <MentionInput
        style={styles.flex1}
        textInputStyle={styles.flex1}
        modalStyle={styles.mentionInputModal}
        modalPosition={'top'}
        onChangeText={onChangeText}
        value={content}
        ComponentInput={PostInput}
        title={t('post:mention_title')}
        emptyContent={t('post:mention_empty_content')}
        getDataPromise={postDataHelper.getSearchMentionAudiences}
        getDataParam={{group_ids: groupIds}}
        getDataResponseKey={'data'}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    flex1: {flex: 1},
    mentionInputModal: {
      position: undefined,
      top: undefined,
      bottom: undefined,
      marginTop: -12,
      maxHeight: 180,
    },
  });
};

export default CreateComment;
