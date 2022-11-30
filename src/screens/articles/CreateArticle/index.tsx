import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Text from '~/baseComponents/Text';
import { createTextStyle } from '~/baseComponents/Text/textStyle';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { useRootNavigation } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '../ArticleDetail/store';
import useCreateArticleStore from './store';

const options = [
  { title: 'article:text_option_edit_title', screen: articleStack.createArticleTitle },
  { title: 'article:text_option_edit_description', screen: articleStack.createArticleSummary },
  { title: 'article:text_option_edit_cover', screen: articleStack.createArticleCover },
  { title: 'article:text_option_edit_category', screen: articleStack.createArticleCategory },
  { title: 'article:text_option_edit_audience', screen: articleStack.createArticleAudience },
  { title: 'article:text_option_edit_series', screen: articleStack.createArticleSeries },
  { title: 'article:text_option_edit_content', screen: articleStack.createArticleContent },
];

const CreateArticle: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleIdParams = route?.params?.articleId;
  const isDraft = route?.params?.isDraft;
  const isCreateNewArticle = !articleIdParams;
  const screenTitle = isCreateNewArticle ? 'create' : 'edit';

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleData = useCreateArticleStore((state) => state.data);
  const actions = useCreateArticleStore((state) => state.actions);
  const draftActions = useDraftArticleStore((state) => state.actions);
  const articleActions = useArticlesStore((state: IArticlesState) => state.actions);

  const [articleId, setArticleId] = useState(articleIdParams);

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

  const onPressItem = (item: any) => {
    if (!item.screen) {
      dispatch(modalActions.showAlertNewFeature());
      return;
    }
    rootNavigation.navigate(item.screen, { articleId, isDraft: isCreateNewArticle });
  };

  const renderItem = ({ item }: any) => (
    <Button style={styles.item} onPress={() => onPressItem(item)}>
      <Text style={styles.itemTitle} useI18n>{item.title}</Text>
      <Icon icon="AngleRight" />
    </Button>
  );

  const renderItemSeparator = () => <Divider margin={spacing.margin.large} />;
  const keyExtractor = (item) => `create_article_option_${item.title}`;

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title={`article:title:${screenTitle}`}
        onPressBack={isDraft ? onPressBackToDraft : undefined}
      />
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderItemSeparator}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const textStyle = createTextStyle(theme);

  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    inputTitle: {
      ...textStyle.bodyMMedium,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderColor: colors.gray5,
      maxHeight: 80,
    },
    item: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.large,
      paddingHorizontal: spacing.padding.large,
    },
    itemTitle: {
      flex: 1,
    },
  });
};

export default CreateArticle;
