import React, {
  FC, memo, useEffect, useState,
} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Text, { TextProps } from '~/beinComponents/Text';

import MarkdownView from '~/beinComponents/MarkdownView';
import Markdown from '~/beinComponents/Markdown';
import CopyableView from '../CopyableView';
import { escapeMarkDown } from '~/utils/formatData';
import postActions from '~/screens/Post/redux/actions';

export interface CollapsibleTextProps extends TextProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  content: string;
  limitLength?: number;
  shortLength?: number;
  toggleOnPress?: boolean;
  useMarkdown?: boolean;
  useMarkdownIt?: boolean;
  limitMarkdownTypes?: boolean;
  parentCommentId?: string;
  copyEnabled?: boolean;
  onPress?: () => void;
  onPressAudience?: (audience: any, e?: any) => any;
  [x: string]: any;
  postId?:string;
}

const _CollapsibleText: FC<CollapsibleTextProps> = ({
  testID,
  style,
  content,
  limitLength = 120,
  shortLength = 120,
  toggleOnPress,
  useMarkdown,
  useMarkdownIt,
  limitMarkdownTypes,
  parentCommentId,
  copyEnabled,
  onPress,
  onPressAudience,
  postId,
  ...textProps
}: CollapsibleTextProps) => {
  const getShortContent = (c?: string) => {
    if (c && c?.length > limitLength) {
      return `${c.substr(
        0, shortLength,
      )}...`;
    }
    return '';
  };

  const dispatch = useDispatch();

  const [contentShowAll, setContentShowAll] = useState(false);
  const [shortContent, setShortContent] = useState(getShortContent(content));

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { t } = useBaseHook();

  useEffect(
    () => {
      const newShort = getShortContent(content);
      if (newShort !== shortContent) {
        setShortContent(newShort);
      }
    }, [content],
  );

  const onToggleShowLess = () => {
    setContentShowAll(!contentShowAll)
    if (!!postId) dispatch(postActions.putMarkSeenPost({ postId }));
  };

  const _onPress = () => {
    if (onPress) {
      onPress();
    } else if (toggleOnPress) {
      onToggleShowLess();
    }
  };

  const renderContentWithMarkdown = () => (
    <View style={style}>
      {useMarkdownIt ? (
        <MarkdownView
          {...textProps}
          limitMarkdownTypes={limitMarkdownTypes}
          onPressAudience={onPressAudience}
        >
          {!shortContent ? content : contentShowAll ? content : shortContent}
        </MarkdownView>
      ) : (
        <Markdown
          {...textProps}
          textTestID={
              parentCommentId
                ? 'collapsible_text.level_2.content'
                : 'collapsible_text.level_1.content'
            }
          onPressAudience={onPressAudience}
          value={
              !shortContent ? content : contentShowAll ? content : shortContent
            }
        />
      )}

      {!!shortContent && (
      <Text.SubtitleS
        testID="collapsible_text.markdown.short_content"
        onPress={onToggleShowLess}
        color={colors.neutral50}
      >
        {contentShowAll
          ? t('common:text_see_less')
          : t('common:text_see_more')}
      </Text.SubtitleS>
      )}
    </View>
  );

  const renderContent = () => (
    <Text style={style}>
      <Text testID="collapsible_text.content" {...textProps}>
        {!shortContent ? content : contentShowAll ? content : shortContent}
      </Text>
      {!!shortContent && (
      <Text.SubtitleS
        testID="collapsible_text.show_text"
        onPress={onToggleShowLess}
        color={colors.neutral50}
      >
        {contentShowAll
          ? t('common:text_see_less')
          : t('common:text_see_more')}
      </Text.SubtitleS>
      )}
    </Text>
  );

  const WrapperComponent = copyEnabled
    ? CopyableView
    : TouchableWithoutFeedback;

  return (
    <WrapperComponent
      testID={testID}
      activeOpacity={0.6}
      content={escapeMarkDown(content)}
      disabled={!(onPress || (toggleOnPress && shortContent))}
      onPress={_onPress}
    >
      {useMarkdown ? renderContentWithMarkdown() : renderContent()}
    </WrapperComponent>
  );
};

const CollapsibleText = memo(_CollapsibleText);
CollapsibleText.whyDidYouRender = true;
export default CollapsibleText;
