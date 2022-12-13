import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';

import TitleArticle from './TitleArticle';
import ContentArticle from './ContentArticle';

interface TopicDetailArticleItemProps {
  article: IPost;
}

const TopicDetailArticleItem: React.FC<TopicDetailArticleItemProps> = ({ article }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const {
    actor, coverMedia, id, summary, title,
  } = article || {};

  return (
    <View style={styles.container}>
      <TitleArticle title={title} />
      <ContentArticle
        id={id}
        summary={summary}
        coverMedia={coverMedia}
        actor={actor}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
  });
};

export default TopicDetailArticleItem;
