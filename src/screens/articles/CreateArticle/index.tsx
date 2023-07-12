import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useEffect, useState, useCallback,
} from 'react';
import {
  FlatList, ListRenderItem, StyleSheet, View,
} from 'react-native';
import Header from '~/beinComponents/Header';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { useRootNavigation } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
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
import Schedule from './components/Schedule';
import SettingsButton from '~/components/ImportantSettings/SettingsButton';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { ArticleBoxScheduleTime } from '~/components/articles';
import CreateBannerImportant from '~/components/ImportantSettings/CreateBannerImportant';
import { PostType } from '~/interfaces/IPost';
import showToastSuccess from '~/store/helper/showToastSuccess';

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
};

const options: OptionType[] = [
  {
    name: SectionName.Cover,
    title: 'article:text_option_edit_cover',
    screen: articleStack.createArticleCover,
  },
  {
    name: SectionName.Title,
    title: 'article:text_option_edit_title',
    screen: articleStack.createArticleTitle,
  },
  {
    name: SectionName.Summary,
    title: 'article:text_option_edit_summary',
    screen: articleStack.createArticleSummary,
  },
  {
    name: SectionName.Category,
    title: 'article:text_option_edit_category',
    screen: articleStack.createArticleCategory,
  },
  {
    name: SectionName.Audience,
    title: 'article:text_option_edit_audience',
    screen: articleStack.createArticleAudience,
  },
  {
    name: SectionName.Series,
    title: 'article:text_option_edit_series',
    screen: articleStack.createArticleSeries,
  },
  {
    name: SectionName.Tags,
    title: 'article:text_option_edit_tags',
    screen: articleStack.createArticleTags,
  },
  {
    name: SectionName.Content,
    title: 'article:text_option_edit_content',
    screen: articleStack.createArticleContent,
  },
];

const CreateArticle: FC<CreateArticleProps> = ({
  route,
}: CreateArticleProps) => {
  const articleIdParams = route?.params?.articleId;
  const isFromDraftScreen = route?.params?.isFromDraftScreen;
  const isFromReviewSchedule = route?.params?.isFromReviewSchedule;
  const isCreateNewArticle = !articleIdParams;
  const screenTitle
    = isCreateNewArticle || isFromDraftScreen ? 'create' : 'edit';

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleDetailData = usePostsStore(
    useCallback(postsSelector.getPost(articleIdParams, {}), [articleIdParams]),
  );
  const { publishedAt, status } = articleDetailData;

  const articleData = useCreateArticleStore((state) => state.data);
  const actions = useCreateArticleStore((state) => state.actions);
  const isDraft = useCreateArticleStore((state) => state.isDraft);
  const isSchedule = useCreateArticleStore((state) => state.isSchedule);
  const draftActions = useDraftArticleStore((state) => state.actions);
  const articleActions = useArticlesStore(
    (state: IArticlesState) => state.actions,
  );
  const { setting } = articleData || {};

  const [articleId, setArticleId] = useState(articleIdParams);

  const { handlePublish, validButtonPublish } = useCreateArticle({ articleId });
  const isPublishing = useDraftArticleStore((state) => state.isPublishing);

  const resetEditArticleStore = useCreateArticleStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);

  useEffect(() => {
    if (isCreateNewArticle) actions.createArticle();
    else articleActions.getArticleDetail({ articleId });
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
    showToastSuccess(null, 'article:text_article_saved_to_draft');
  };

  const onPressPublish = () => {
    handlePublish();
  };

  const disabled = !validButtonPublish || isPublishing;

  const btnPublish = (isDraft && !isFromReviewSchedule) && {
    buttonProps: { disabled, loading: isPublishing, style: styles.btnPublish },
    buttonText: t('common:btn_publish'),
    onPressButton: onPressPublish,
  };

  const renderBtnSchedule = () => {
    if (isDraft || isSchedule) return (<Schedule articleId={articleId} />);

    return null;
  };

  const renderBtnSettings = () => (<SettingsButton type={PostType.ARTICLE} articleId={articleId} />);

  const renderCustomComponent = () => (
    <>
      {renderBtnSettings()}
      {renderBtnSchedule()}
    </>
  );

  const headerButton = {
    renderCustomComponent,
    ...btnPublish,
  };

  const onPressItem = (item: OptionType) => () => {
    if (!item.screen) {
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
        return (
          <AudienceSection articleId={articleId} onPress={onPressItem(item)} />
        );
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

  const renderHeaderComponent = () => (
    <>
      {!!setting?.isImportant && (
        <CreateBannerImportant
          type="article"
          expiresTime={setting.importantExpiredAt}
          style={styles.bannerImportantTime}
        />
      )}
      {isFromReviewSchedule && (
        <ArticleBoxScheduleTime
          publishedAt={publishedAt}
          status={status}
        />
      )}
      <ViewSpacing height={spacing.margin.large} />
    </>
  );

  const renderItemSeparator = () => (
    <ViewSpacing height={spacing.margin.large} />
  );
  const keyExtractor = (item) => `create_article_option_${item.title}`;

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title={`article:title:${screenTitle}`}
        onPressBack={isFromDraftScreen ? onPressBackToDraft : undefined}
        {...headerButton}
        removeBorderAndShadow={isFromReviewSchedule}
      />
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderItemSeparator}
        ListHeaderComponent={renderHeaderComponent}
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
    bannerImportantTime: {
      backgroundColor: colors.white,
      paddingBottom: spacing.padding.large,
    },
  });
};

export default CreateArticle;
