import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList, ListRenderItem, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { useRootNavigation } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '../ArticleDetail/store';
import useCreateArticleStore from './store';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { CreateArticleCover } from './screens';
import TitleSection from './screens/CreateArticleTitle/TitleSection';
import SummarySection from './screens/CreateArticleSummary/SummarySection';
import CategorySection from './screens/CreateArticleCategory/CategorySection';
import AudienceSection from './screens/CreateArticleAudience/AudienceSection';
import SeriesSection from './screens/CreateArticleSeries/SeriesSection';
import TagsSection from './screens/CreateArticleTags/TagsSection';
import ContentSection from './screens/CreateArticleContent/ContentSection';
import { useBaseHook } from '~/hooks';
import useCreateArticle from './hooks/useCreateArticle';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { PostStatus } from '~/interfaces/IPost';

enum SectionName {
  Title,
  Summary,
  Cover,
  Category,
  Audience,
  Series,
  Tags,
  Content,
}

type OptionType = {
  name: SectionName;
  title: string;
  screen: string;
}

const options: OptionType[] = [
  { name: SectionName.Cover, title: 'article:text_option_edit_cover', screen: articleStack.createArticleCover },
  { name: SectionName.Title, title: 'article:text_option_edit_title', screen: articleStack.createArticleTitle },
  { name: SectionName.Summary, title: 'article:text_option_edit_summary', screen: articleStack.createArticleSummary },
  { name: SectionName.Category, title: 'article:text_option_edit_category', screen: articleStack.createArticleCategory },
  { name: SectionName.Audience, title: 'article:text_option_edit_audience', screen: articleStack.createArticleAudience },
  { name: SectionName.Series, title: 'article:text_option_edit_series', screen: articleStack.createArticleSeries },
  { name: SectionName.Tags, title: 'article:text_option_edit_tags', screen: articleStack.createArticleTags },
  { name: SectionName.Content, title: 'article:text_option_edit_content', screen: articleStack.createArticleContent },
];

const CreateArticle: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleIdParams = route?.params?.articleId;
  const isFromDraftScreen = route?.params?.isFromDraftScreen;
  const isCreateNewArticle = !articleIdParams;
  const screenTitle = isCreateNewArticle || isFromDraftScreen ? 'create' : 'edit';

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleData = useCreateArticleStore((state) => state.data);
  const actions = useCreateArticleStore((state) => state.actions);
  const draftActions = useDraftArticleStore((state) => state.actions);
  const articleActions = useArticlesStore((state: IArticlesState) => state.actions);

  const [articleId, setArticleId] = useState(articleIdParams);

  const article = usePostsStore(postsSelector.getPost(articleId, {}));

  const {
    handlePublish, validButtonPublish,
  } = useCreateArticle({ articleId });
  const isPublishing = useDraftArticleStore((state) => state.isPublishing);

  const resetEditArticleStore = useCreateArticleStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);

  useEffect(() => {
    if (isCreateNewArticle) actions.createArticle();
    else articleActions.getArticleDetail(articleId);
  }, []);

  useEffect(
    () => () => {
      resetEditArticleStore();
      resetMentionInputStore();
    },
    [],
  );

  // Wair for creating article process then update id
  useEffect(() => {
    if (articleData?.id) setArticleId(articleData.id);
  }, [articleData?.id]);

  const onPressBackToDraft = () => {
    // For editing draft article, navigating back needs to refresh data
    draftActions.getDraftArticles({ isRefresh: true });
    rootNavigation.goBack();
  };

  const onPressPublish = () => {
    handlePublish();
  };

  const disabled = !validButtonPublish || isPublishing;

  const btnPublish = {
    buttonProps: { disabled, loading: isPublishing, style: styles.btnPublish },
    buttonText: t('common:btn_publish'),
    onPressButton: onPressPublish,
  };

  const onPressItem = (item: OptionType) => () => {
    if (!item.screen) {
      dispatch(modalActions.showAlertNewFeature());
      return;
    }
    rootNavigation.navigate(item.screen, { articleId });
  };

  const renderItem: ListRenderItem<OptionType> = ({ item }) => {
    switch (item.name) {
      case SectionName.Cover:
        return <CreateArticleCover articleId={articleId} />;
      case SectionName.Title:
        return <TitleSection onPress={onPressItem(item)} />;
      case SectionName.Summary:
        return <SummarySection onPress={onPressItem(item)} />;
      case SectionName.Category:
        return <CategorySection onPress={onPressItem(item)} />;
      case SectionName.Audience:
        return <AudienceSection articleId={articleId} onPress={onPressItem(item)} />;
      case SectionName.Series:
        return <SeriesSection onPress={onPressItem(item)} />;
      case SectionName.Tags:
        return <TagsSection onPress={onPressItem(item)} />;
      case SectionName.Content:
        return <ContentSection onPress={onPressItem(item)} />;
      default:
        return null;
    }
  };

  const renderItemSeparator = () => <ViewSpacing height={spacing.margin.large} />;
  const keyExtractor = (item) => `create_article_option_${item.title}`;

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title={`article:title:${screenTitle}`}
        onPressBack={isFromDraftScreen ? onPressBackToDraft : undefined}
        {
         ...(article.status === PostStatus.DRAFT && btnPublish)
         }
      />
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderItemSeparator}
        ListHeaderComponent={renderItemSeparator}
        ListFooterComponent={renderItemSeparator}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral5,
    },
    btnPublish: {
      marginRight: spacing.margin.small,
    },
  });
};

export default CreateArticle;
