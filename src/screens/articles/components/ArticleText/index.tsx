import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import Text from '~/beinComponents/Text';
import { getTextHighlight } from './helper';

type ArticleTextProps = {
  text: string;
  type: 'title' | 'summary';
};

const ArticleText: FC<ArticleTextProps> = ({ text, type }) => {
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
          style={{ backgroundColor: item.isHighlight && '#f4ed78' }}
        >
          {item.text}
        </Text>
      ))}
    </Text>
  );
};

export default ArticleText;
