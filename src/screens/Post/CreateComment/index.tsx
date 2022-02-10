import React, {FC, useRef, useEffect} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {IActivityData, IReaction} from '~/interfaces/IPost';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostInput from '~/beinComponents/inputs/PostInput';
import i18n from '~/localization';
import _MentionInput from '~/beinComponents/inputs/_MentionInput';

export interface CreateCommentProps {
  route?: {
    params?: {
      commentId?: string;
      groupIds?: string;
    };
  };
}

const CreateComment: FC<CreateCommentProps> = ({route}: CreateCommentProps) => {
  const mentionInputRef = useRef<any>();
  const {commentId, groupIds} = route?.params || {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle();

  const comment: IReaction =
    useKeySelector(postKeySelector.commentById(commentId)) || {};
  const oldContent = comment?.data?.content;

  const loading = useKeySelector(postKeySelector.createComment.loading);
  const content = useKeySelector(postKeySelector.createComment.content);

  const isEditHasChange = content !== oldContent;
  const disableButton = !content || content === oldContent || loading;

  useEffect(() => {
    if (oldContent) {
      dispatch(postActions.setCreateComment({content: oldContent}));
    }
    if (oldContent && !mentionInputRef?.current?.getContent?.()) {
      mentionInputRef?.current?.setContent?.(oldContent);
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
          useI18n: true,
          highEmphasis: true,
        }}
        onPressBack={onPressBack}
        onPressButton={onPressComment}
      />
      <_MentionInput
        groupIds={groupIds || ''}
        mentionInputRef={mentionInputRef}
        style={styles.flex1}
        textInputStyle={styles.flex1}
        ComponentInput={PostInput}
        componentInputProps={{
          modalStyle: styles.mentionInputModal,
          value: content,
          loading: loading,
          isHandleUpload: true,
          placeholder: i18n.t('post:placeholder_write_comment'),
          onChangeText,
        }}
        autocompleteProps={{
          modalPosition: 'top',
          title: i18n.t('post:mention_title'),
          emptyContent: i18n.t('post:mention_empty_content'),
          modalStyle: styles.mentionInputModal,
        }}
      />
    </ScreenWrapper>
  );
};

const createStyle = () => {
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
