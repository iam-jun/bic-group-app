import React, {
  FC, memo, useCallback, useMemo, useState,
} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Text, { TextProps } from '~/beinComponents/Text';

import MarkdownView from '~/beinComponents/MarkdownView';
import Markdown from '~/beinComponents/Markdown';
import CopyableView from '../../CopyableView';
import { escapeMarkDown } from '~/utils/formatData';
import spacing from '~/theme/spacing';

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
  BottomRightComponent?: React.ReactNode | React.ReactElement;

  onPress?: () => void;
  onPressAudience?: (audience: any, e?: any) => any;
  onToggleShowTextContent?: () => void;
  [x: string]: any;
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
  BottomRightComponent,
  onPress,
  onPressAudience,
  onToggleShowTextContent,
  ...textProps
}: CollapsibleTextProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();

  const [contentShowAll, setContentShowAll] = useState(false);

  const shortContent = useMemo(() => getShortContent(content, limitLength, shortLength), [content]);

  const _content = !shortContent ? content : contentShowAll ? content : shortContent;

  const _onToggleShowTextContent = useCallback(() => {
    setContentShowAll(!contentShowAll);
    onToggleShowTextContent?.();
  }, [contentShowAll]);

  const _onPress = () => {
    if (onPress) {
      onPress();
    } else if (toggleOnPress) {
      _onToggleShowTextContent();
    }
  };

  const renderShortContent = () => {
    if (!shortContent) return null;

    return (
      <View style={styles.row}>
        <Text.SubtitleM
          testID="collapsible_text.short_content"
          onPress={_onToggleShowTextContent}
          color={colors.neutral60}
        >
          {contentShowAll
            ? t('common:text_see_less')
            : t('common:text_see_more')}
        </Text.SubtitleM>
        {BottomRightComponent}
      </View>
    );
  };

  const renderContentWithMarkdown = () => (
    <View style={style}>
      {useMarkdownIt ? (
        <MarkdownView
          {...textProps}
          limitMarkdownTypes={limitMarkdownTypes}
          onPressAudience={onPressAudience}
        >
          {_content}
        </MarkdownView>
      ) : (
        <Markdown
          {...textProps}
          textTestID={
            parentCommentId
              ? 'collapsible_text.level_2.content'
              : 'collapsible_text.level_1.content'
          }
          limitMarkdownTypes={limitMarkdownTypes}
          onPressAudience={onPressAudience}
          value={_content}
        />
      )}
      {renderShortContent()}
    </View>
  );

  const renderContent = () => (
    <View style={style}>
      <Text testID="collapsible_text.content" {...textProps}>
        {_content}
      </Text>
      {renderShortContent()}
    </View>
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.padding.base,
  },
});

const CollapsibleText = memo(_CollapsibleText);
CollapsibleText.whyDidYouRender = true;
export default CollapsibleText;

const getShortContent = (c: string, limitLength: number, shortLength: number) => {
  if (!c) return '';

  if (c && c.length > limitLength) {
    return `${c.substring(
      0, shortLength,
    )}...`;
  }
  return '';
};
