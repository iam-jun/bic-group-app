import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { estimateReadingTimeArticle } from './helpter';

interface ArticleReadingTimeProps {
    countWords: number;
}

const ArticleReadingTime: React.FC<ArticleReadingTimeProps> = ({ countWords }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const readingTime = estimateReadingTimeArticle(countWords);

  return (
    <View style={styles.container} testID="article_reading_time.content">
      <Icon
        icon="Clock"
        tintColor={colors.purple50}
        size={14}
        style={styles.icon}
      />
      <Text.BodyS color={colors.neutral40}>
        {`${t('article:reading_time')}:`}
        {' '}
        {t('article:about')}
        {' '}
        { readingTime }
        {' '}
        {t('article:minute')}
      </Text.BodyS>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.base,
    paddingBottom: spacing.padding.xSmall,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.margin.small,
  },
});

export default ArticleReadingTime;
