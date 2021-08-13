import React, {FC, useEffect, useState} from 'react';
import Text, {TextProps} from '~/beinComponents/Text';
import i18next from 'i18next';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';

export interface CollapsibleTextProps extends TextProps {
  style?: StyleProp<ViewStyle>;
  content: string;
  limitLength?: number;
  shortLength?: number;
  onPress?: () => void;
  toggleOnPress?: boolean;
}

const CollapsibleText: FC<CollapsibleTextProps> = ({
  style,
  content,
  limitLength = 120,
  shortLength = 120,
  onPress,
  toggleOnPress,
  ...textProps
}: CollapsibleTextProps) => {
  const [contentShowAll, setContentShowAll] = useState(false);
  const [shortContent, setShortContent] = useState('');

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  useEffect(() => {
    if (content && content?.length > limitLength) {
      setShortContent(`${content.substr(0, shortLength)}...`);
    }
  }, [content]);

  const onToggleShowLess = () => setContentShowAll(!contentShowAll);

  const _onPress = () => {
    if (onPress) {
      onPress();
    } else if (toggleOnPress) {
      onToggleShowLess();
    }
  };

  return (
    <TouchableOpacity
      disabled={!(onPress || (toggleOnPress && shortContent))}
      onPress={_onPress}>
      <Text style={style}>
        <Text {...textProps}>
          {!shortContent ? content : contentShowAll ? content : shortContent}
        </Text>
        {!!shortContent && (
          <Text onPress={onToggleShowLess} color={colors.textInfo}>
            {` ${
              contentShowAll
                ? i18next.t('common:text_show_less')
                : i18next.t('common:text_read_more')
            }`}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default CollapsibleText;
