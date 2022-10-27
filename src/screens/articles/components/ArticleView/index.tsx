import { View, StyleSheet } from 'react-native';
import React, { FC, useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { margin } from '~/theme/spacing';
import ArticleHeader from '../ArticleHeader';
import Text from '~/beinComponents/Text';
import ArticleWebview from '../ArticleWebview';
import ArticleReactions from '../ArticleReactions';
import Divider from '~/beinComponents/Divider';
import HashTags from '../HashTags';
import ArticleFooter from '../ArticleFooter';
import LoadMoreComment from '~/screens/post/components/LoadMoreComment';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { ReactionType } from '~/constants/reactions';
import { useBaseHook } from '~/hooks';
import { IMentionUser } from '~/interfaces/IPost';

interface Props {
    id: string;
    article: any;
    isLoaded: boolean;
    firstCommentId: string;

    onInitializeEnd: ()=> void;
    onAddReaction: (id: ReactionType) => void,
    onRemoveReaction: (id: ReactionType) => void,
    onPressMentionAudience: (user: IMentionUser)=> void;

}

const ArticleView: FC<Props> = ({
  id,
  article,
  isLoaded,
  firstCommentId,

  onInitializeEnd,
  onAddReaction,
  onRemoveReaction,
  onPressMentionAudience,

}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {
    title, audience, actor, createdAt, commentsCount,
    reactionsCount, setting, hashtags, ownerReactions,
  } = article;

  const canLoadMoreComment = usePostsStore(useCallback(postsSelector.getCommentOnlyCount(id), []));

  const commentCountText = commentsCount || '';
  const labelButtonComment = `${commentCountText}${t('post:button_comment')}`;

  return (
    <View style={styles.container}>
      <ArticleHeader
        articleId={id}
        actor={actor}
        time={createdAt}
        audience={audience}
      />
      <View style={styles.body}>
        <Text.H3
          testID="post_view_content"
          style={styles.title}
        >
          {title}
        </Text.H3>
        <ArticleWebview
          readOnly
          isLoaded={isLoaded}
          articleData={article}
          onInitializeEnd={onInitializeEnd}
          onPressMentionAudience={onPressMentionAudience}
        />
        <HashTags data={hashtags} />
        <Divider />
      </View>
      <View>
        <ArticleReactions
          id={id}
          ownerReactions={ownerReactions}
          reactionsCount={reactionsCount}
          onAddReaction={onAddReaction}
          onRemoveReaction={onRemoveReaction}
        />
        <ArticleFooter
          articleId={id}
          labelButtonComment={labelButtonComment}
          reactionCounts={reactionsCount}
          canReact={setting?.canReact}
          canComment={setting?.canComment}
          onAddReaction={onAddReaction}
        />
        <Divider style={styles.divider} />
      </View>
      {
         canLoadMoreComment && (
         <LoadMoreComment
           title="post:text_load_more_comments"
           postId={id}
           idLessThan={firstCommentId}
         />
         )
        }
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
    },
    body: {
      marginVertical: margin.small,
    },
    title: {
      marginVertical: margin.base,
      marginHorizontal: margin.large,
    },
    footer: {
      height: margin.base,
      backgroundColor: colors.white,
    },
    divider: {
      marginHorizontal: margin.large,
    },
  });
};

export default ArticleView;
