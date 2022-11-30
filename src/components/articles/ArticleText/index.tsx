import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import Text from '~/baseComponents/Text';
import { getTextHighlight } from './helper';

export type ArticleTextProps = {
  text: string;
};

type ArticleTextComponentProps = ArticleTextProps & { type?: 'title' | 'summary' }

const ArticleText: FC<ArticleTextComponentProps> = ({ text, type }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const textVariant = type === 'title' ? 'h3' : 'paragraphM';

  const lstText = getTextHighlight(text);

  return (
    <Text variant={textVariant} color={colors.neutral80}>
      {lstText.map((item) => (
        <Text
          key={`${item.id}`}
          variant={textVariant}
          color={colors.neutral80}
          style={{ backgroundColor: item.isHighlight && colors.highlight }}
        >
          {item.text}
        </Text>
      ))}
    </Text>
  );
};

export const ArticleTitle: FC<ArticleTextProps> = (props) => <ArticleText {...props} type="title" />;
export const ArticleSummary: FC<ArticleTextProps> = (props) => <ArticleText {...props} type="summary" />;
