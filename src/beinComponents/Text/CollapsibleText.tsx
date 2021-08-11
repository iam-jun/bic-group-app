import React, {FC, useEffect, useState} from 'react';
import Text, {TextProps} from '~/beinComponents/Text';
import i18next from 'i18next';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface CollapsibleTextProps {
  content: string;
  textProps?: TextProps;
  limitLength?: number;
  shortLength?: number;
}

const CollapsibleText: FC<CollapsibleTextProps> = ({
  content,
  textProps,
  limitLength = 120,
  shortLength = 120,
}: CollapsibleTextProps) => {
  const [contentShowAll, setContentShowAll] = useState(false);
  const [shortDescription, shortContent] = useState('');

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  useEffect(() => {
    if (content && content?.length > limitLength) {
      shortContent(`${content.substr(0, shortLength)}...`);
    }
  }, [content]);

  return (
    <Text {...textProps}>
      <Text>{contentShowAll ? content : shortDescription}</Text>
      {!!shortDescription && (
        <Text
          onPress={() => setContentShowAll(!contentShowAll)}
          color={colors.textInfo}>
          {` ${
            contentShowAll
              ? i18next.t('common:text_show_less')
              : i18next.t('common:text_read_more')
          }`}
        </Text>
      )}
    </Text>
  );
};

export default CollapsibleText;
