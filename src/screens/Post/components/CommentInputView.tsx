import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import {debounce} from 'lodash';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {IRequestPostComment} from '~/interfaces/IPost';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {useUserIdAuth} from '~/hooks/auth';
import Button from '~/beinComponents/Button';
import {usePostDetailReplyingComment} from '~/hooks/post';
import {useBaseHook} from '~/hooks';

export interface CommentInputViewProps {
  postId: string;
  groupIds: string;
  autoFocus?: boolean;
  textInputRef?: any;
}

const CommentInputView: FC<CommentInputViewProps> = ({
  postId,
  groupIds = '',
  autoFocus,
  textInputRef,
}: CommentInputViewProps) => {
  const [content, setContent] = useState<string>();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const mentionKey = useKeySelector(postKeySelector.mention.searchKey);
  const mentionResult = useKeySelector(postKeySelector.mention.searchResult);

  const replying = usePostDetailReplyingComment();

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
  }, []);

  const onPressSend = () => {
    if (postId) {
      setContent('');
      dispatch(postActions.setPostDetailReplyingComment());
      const commentData = {content: content?.trim()};
      const replyCmtId = replying?.id;
      const requestData: IRequestPostComment = {
        referenceId: replyCmtId || postId,
        referenceType: replyCmtId ? 'comment' : 'post',
        commentData,
        userId,
      };
      postDataHelper
        .postNewComment(requestData)
        .then(response => {
          if (response && response.data) {
            dispatch(postActions.getCommentsById({id: postId, isMerge: false}));
          }
        })
        .catch(e => {
          console.log('\x1b[33m', '🐣️ postNewComment error : ', e, '\x1b[0m');
        });
    } else {
      console.log('\x1b[31m', '🐣️  | onPressSend : invalid id ', '\x1b[0m');
    }
  };

  const onChangeText = (value: string) => {
    setContent(value);
  };

  const onPressMentionAudience = (audience: any) => {
    if (content) {
      const mention = `@[u:${audience.id}:${
        audience.fullname || audience.name
      }] `;
      const newContent = content.replace(`@${mentionKey}`, mention);
      setContent(newContent);

      dispatch(postActions.setMentionSearchResult([]));
      dispatch(postActions.setMentionSearchKey(''));
    }
  };

  const onMentionText = debounce((textMention: string) => {
    console.log(`\x1b[36m🐣️ CommentInputView ${textMention}\x1b[0m`);
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

  const renderCommentInputHeader = () => {
    if (!replying) {
      return null;
    }
    return (
      <View style={styles.commentInputHeader}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1}}>
            <Text>
              {t('post:reply_comment_1')}
              <Text.BodyM>
                {replying?.user?.data?.fullname || t('post:someone')}
              </Text.BodyM>
              <Text>{t('post:reply_comment_2')}</Text>
            </Text>
          </Text>
          <Button
            onPress={() =>
              dispatch(postActions.setPostDetailReplyingComment())
            }>
            <Text.BodyS>
              {'• '}
              <Text.BodyM useI18n color={colors.primary7}>
                common:btn_cancel
              </Text.BodyM>
            </Text.BodyS>
          </Button>
        </View>
      </View>
    );
  };

  return (
    <MentionInput
      data={mentionResult}
      modalPosition={'top'}
      isMentionModalVisible={!!content && mentionResult?.length > 0}
      onPress={onPressMentionAudience}
      onChangeText={onChangeText}
      onMentionText={onMentionText}
      value={content}
      ComponentInput={CommentInput}
      componentInputProps={{
        textInputRef: textInputRef,
        value: content,
        autoFocus: autoFocus,
        onPressSend: onPressSend,
        HeaderComponent: renderCommentInputHeader(),
      }}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    commentInputHeader: {
      marginHorizontal: spacing?.margin.base,
      marginTop: spacing?.margin.tiny,
    },
  });
};

export default CommentInputView;
