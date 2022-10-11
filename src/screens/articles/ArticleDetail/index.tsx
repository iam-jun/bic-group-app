import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRootNavigation } from '~/hooks/navigation';
import { IMarkdownAudience } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';

import spacing, { margin } from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '~/store/entities/articles';
import { useBaseHook } from '~/hooks';
import Header from '~/beinComponents/Header';
import { IRouteParams } from '~/interfaces/IRouter';
import ArticleHeader from '../components/ArticleHeader';
import Markdown from '~/beinComponents/Markdown';
import Text from '~/beinComponents/Text';
import HashTags from '../components/HashTags';
import ArticleFooter from '../components/ArticleFooter';

const ArticleDetail: FC<IRouteParams> = (props) => {
  const { params } = props.route;
  const id = params?.articleId;

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const data = useArticlesStore((state: IArticlesState) => state.items[id]);
  const actions = useArticlesStore((state: IArticlesState) => state.actions);
  const {
    title, content, audience, actor, createdAt, commentCount,
    reactionsCount, setting, mentions, hashtags,
  } = data || {};
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  useEffect(() => {
    actions.getArticleDetail(id);
  }, []);

  const onPressMentionAudience = useRef((audience: IMarkdownAudience) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: audience.id },
      );
    }
  }).current;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.contentContainer}>
          <ArticleHeader
            articleId={id}
            actor={actor}
            time={createdAt}
            audience={audience}
          />
          <Text.H3
            testID="post_view_content"
            style={styles.title}
          >
            {title}
          </Text.H3>
          <Markdown
            testID="post_view_content"
            copyEnabled
            disableImage={false}
            value={content}
            mentions={mentions}
            onPressAudience={onPressMentionAudience}
          />
          <HashTags data={hashtags} />
          <ArticleFooter
            articleId={id}
            labelButtonComment={labelButtonComment}
            reactionCounts={reactionsCount}
            canReact={setting?.canReact}
            canComment={setting?.canComment}
          />
        </View>
      </ScrollView>
      {/* <PostPhotoPreview
        data={images || []}
        uploadType="postImage"
        enableGalleryModal
      /> */}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.white,
      marginVertical: spacing.margin.small,
      paddingHorizontal: spacing.margin.large,
    },
    title: {
      marginVertical: margin.base,
    },
  });
};

export default ArticleDetail;
