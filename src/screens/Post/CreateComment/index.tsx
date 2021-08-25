import React, {FC, useState, useEffect} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {debounce} from 'lodash';
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
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const comment: IReaction =
    useKeySelector(postKeySelector.commentById(commentId)) || {};
  const oldContent = comment?.data?.content;

  const loading = useKeySelector(postKeySelector.createComment.loading);
  const mentionKey = useKeySelector(postKeySelector.mention.searchKey);
  const mentionResult = useKeySelector(postKeySelector.mention.searchResult);

  const isEditHasChange = content !== oldContent;
  const disableButton = content === oldContent || loading;

  useEffect(() => {
    if (oldContent) {
      setContent(oldContent);
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

  const onMentionText = debounce((textMention: string) => {
    if (textMention) {
      dispatch(postActions.setMentionSearchKey(textMention));
      dispatch(
        postActions.getSearchMentionAudiences({
          key: textMention,
          group_ids: groupIds,
        }),
      );
    } else if (mentionKey || mentionResult?.length > 0) {
      dispatch(postActions.setMentionSearchResult([]));
      dispatch(postActions.setMentionSearchKey(''));
    }
  }, 300);

  const onPressMentionAudience = (audience: any) => {
    const mention = `@[u:${audience.id}:${
      audience.fullname || audience.name
    }] `;
    const newContent = content.replace(`@${mentionKey}`, mention);
    setContent(newContent);

    dispatch(postActions.setMentionSearchResult([]));
    dispatch(postActions.setMentionSearchKey(''));
  };

  const onChangeText = (text: string) => {
    setContent(text);
  };

  const onPressBack = () => {
    Keyboard.dismiss();
    if (isEditHasChange) {
      dispatch(
        modalActions.showAlert({
          title: t('post:alert_title_back_edit_post'),
          content: t('post:alert_content_back_edit_post'),
          cancelBtn: true,
          confirmLabel: t('common:btn_discard'),
          onConfirm: () => rootNavigation.goBack(),
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
        data={mentionResult}
        style={styles.flex1}
        textInputStyle={styles.flex1}
        modalStyle={styles.mentionInputModal}
        modalPosition={'top'}
        isMentionModalVisible={!!content && mentionResult?.length > 0}
        onPress={onPressMentionAudience}
        onChangeText={onChangeText}
        onMentionText={onMentionText}
        value={content}
        ComponentInput={PostInput}
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
