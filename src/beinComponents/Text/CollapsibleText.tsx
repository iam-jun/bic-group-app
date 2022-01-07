import React, {FC, memo, useEffect, useState} from 'react';
import {View, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import MarkdownView from '~/beinComponents/MarkdownView';
import Markdown from '~/beinComponents/Markdown';

export interface CollapsibleTextProps extends TextProps {
  style?: StyleProp<ViewStyle>;
  content: string;
  limitLength?: number;
  shortLength?: number;
  onPress?: () => void;
  toggleOnPress?: boolean;
  useMarkdown?: boolean;
  useMarkdownIt?: boolean;
  onPressAudience?: (audience: any) => any;
  limitMarkdownTypes?: boolean;
  testID?: string;
  [x: string]: any;
}

const _CollapsibleText: FC<CollapsibleTextProps> = ({
  style,
  content,
  limitLength = 120,
  shortLength = 120,
  onPress,
  toggleOnPress,
  useMarkdown,
  useMarkdownIt,
  onPressAudience,
  limitMarkdownTypes,
  testID,
  ...textProps
}: CollapsibleTextProps) => {
  const getShortContent = (c?: string) => {
    if (c && c?.length > limitLength) {
      return `${c.substr(0, shortLength)}...`;
    } else {
      return '';
    }
  };

  const [contentShowAll, setContentShowAll] = useState(false);
  const [shortContent, setShortContent] = useState(getShortContent(content));

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  useEffect(() => {
    const newShort = getShortContent(content);
    if (newShort !== shortContent) {
      setShortContent(newShort);
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
        {useMarkdownIt ? (
          <MarkdownView
            {...textProps}
            limitMarkdownTypes={limitMarkdownTypes}
            onPressAudience={onPressAudience}>
            {!shortContent ? content : contentShowAll ? content : shortContent}
          </MarkdownView>
        ) : (
          <Markdown
            {...textProps}
            onPressAudience={onPressAudience}
            value={
              !shortContent ? content : contentShowAll ? content : shortContent
            }
          />
        )}

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
      testID={testID}
      activeOpacity={0.6}
      disabled={!(onPress || (toggleOnPress && shortContent))}
      onPress={_onPress}>
      {useMarkdown ? renderContentWithMarkdown() : renderContent()}
    </TouchableOpacity>
  );
};

const CollapsibleText = memo(_CollapsibleText);
CollapsibleText.whyDidYouRender = true;
export default CollapsibleText;
