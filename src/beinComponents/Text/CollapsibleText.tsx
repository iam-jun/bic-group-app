import React, {FC, memo, useEffect, useState} from 'react';
import {View, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import MarkdownView from '~/beinComponents/MarkdownView';

export interface CollapsibleTextProps extends TextProps {
  style?: StyleProp<ViewStyle>;
  content: string;
  limitLength?: number;
  shortLength?: number;
  onPress?: () => void;
  toggleOnPress?: boolean;
  useMarkdown?: boolean;
  onPressAudience?: (audience: any) => any;
  limitMarkdownTypes?: boolean;
  [x: string]: any;
}

const CollapsibleText: FC<CollapsibleTextProps> = ({
  style,
  content,
  limitLength = 120,
  shortLength = 120,
  onPress,
  toggleOnPress,
  useMarkdown,
  onPressAudience,
  limitMarkdownTypes,
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

  const renderContentWithMarkdown = () => {
    return (
      <View style={style}>
        <MarkdownView
          limitMarkdownTypes={limitMarkdownTypes}
          onPressAudience={onPressAudience}>
          {!shortContent ? content : contentShowAll ? content : shortContent}
        </MarkdownView>
        {!!shortContent && (
          <Text onPress={onToggleShowLess} color={colors.textInfo}>
            {contentShowAll
              ? i18next.t('common:text_show_less')
              : i18next.t('common:text_read_more')}
          </Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
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
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={!(onPress || (toggleOnPress && shortContent))}
      onPress={_onPress}>
      {useMarkdown ? renderContentWithMarkdown() : renderContent()}
    </TouchableOpacity>
  );
};

const CollapsibleTextMemo = memo(CollapsibleText);
CollapsibleTextMemo.whyDidYouRender = true;
export default CollapsibleText;
