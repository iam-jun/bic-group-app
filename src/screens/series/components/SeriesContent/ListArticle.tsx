import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import { formatNumberWithZeroPrefix } from '~/utils/formatData';

type ListArticleProps = {
  lstArticle: any;
};

type ArticleItemProps = {
  index: number;
  article: any;
};

const ArticleItem: FC<ArticleItemProps> = ({ index, article }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { title } = article;

  return (
    <View style={styles.articleItemContainer}>
      <Text.H4>{formatNumberWithZeroPrefix(index)}</Text.H4>
      <Text style={styles.slash}>/</Text>
      <View style={{ flex: 1 }}>
        <Text.BadgeL color={colors.neutral80} numberOfLines={2}>
          {title}
        </Text.BadgeL>
      </View>
    </View>
  );
};

const ListArticle: FC<ListArticleProps> = ({ lstArticle }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  if (lstArticle.length === 0) return null;

  return (
    <View>
      {lstArticle.map((item, index) => (
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
      marginTop: spacing.margin.large,
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
