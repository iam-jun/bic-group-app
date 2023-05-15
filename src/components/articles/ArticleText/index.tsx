import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { getTextHighlight } from './helper';

export type ArticleTextProps = {
  text: string;
};

type ArticleTextComponentProps = ArticleTextProps & { type?: 'title' | 'summary' }

const ArticleText: FC<ArticleTextComponentProps> = ({ text, type }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const textVariant = type === 'title' ? 'h1' : 'paragraphM';

  const lstText = getTextHighlight(text);

  return (
    <Text testID={`article_text.${type}`} variant={textVariant} color={colors.neutral80}>
      {lstText.map((item) => (
        <Text
          key={`${item.id}`}
          variant={textVariant}
          color={colors.neutral80}
          style={item.isHighlight && styles.highlight}
        >
          {item.text}
        </Text>
      ))}
    </Text>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    highlight: {
      backgroundColor: colors.highlight,
    },
  });
};

export const ArticleTitle: FC<ArticleTextProps> = (props) => <ArticleText {...props} type="title" />;
export const ArticleSummary: FC<ArticleTextProps> = (props) => <ArticleText {...props} type="summary" />;
