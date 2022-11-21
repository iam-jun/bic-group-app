import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import { formatNumberWithZeroPrefix } from '~/utils/formatData';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

type ListArticleProps = {
  listArticle: any;
};

type ArticleItemProps = {
  index: number;
  article: any;
};

const ArticleItem: FC<ArticleItemProps> = ({ index, article }) => {
  const theme = useTheme();
  const { rootNavigation } = useRootNavigation();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { title } = article;

  const goToArticleDetail = () => {
    rootNavigation.navigate(articleStack.articleDetail, { articleId: article?.id, focusComment: true });
  };

  return (
    <Button
      style={styles.articleItemContainer}
      onPress={goToArticleDetail}
      testID="list_article.article_item"
    >
      <Text.H4 color={colors.neutral20}>{formatNumberWithZeroPrefix(index)}</Text.H4>
      <Text style={styles.slash}>/</Text>
      <View style={{ flex: 1 }}>
        <Text.BadgeL color={colors.neutral80} numberOfLines={2}>
          {title}
        </Text.BadgeL>
      </View>
    </Button>
  );
};

const ListArticle: FC<ListArticleProps> = ({ listArticle }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  if (listArticle?.length === 0) return null;

  return (
    <View style={styles.container}>
      {listArticle?.map((item, index) => (
        <>
          <ArticleItem
            key={`artc-series-${item.id}`}
            index={index + 1}
            article={item}
          />
          <View style={styles.separator} />
        </>
      ))}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.xTiny,
    },
    articleItemContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 10,
      paddingTop: 26,
    },
    slash: {
      color: colors.neutral20,
      marginHorizontal: spacing.margin.small,
    },
    separator: {
      borderWidth: 0.5,
      borderColor: colors.neutral5,
      borderStyle: 'dashed',
    },
  });
};

export default ListArticle;
