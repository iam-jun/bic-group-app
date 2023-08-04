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

import { isEqual } from 'lodash';
import { useBaseHook } from '~/hooks';
import Text, { TextProps } from '~/baseComponents/Text';

import MarkdownView from '~/beinComponents/MarkdownView';
import Markdown from '~/beinComponents/Markdown';
import CopyableView from '../../../beinComponents/CopyableView';
import { escapeMarkDown } from '~/utils/formatter';
import spacing from '~/theme/spacing';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadAction, TrackingEventType } from '~/services/tracking/constants';

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
  mentions?: any;
  BottomRightComponent?: React.ReactNode | React.ReactElement;
  isTracking?: boolean;

  onPress?: () => void;
  onPressAudience?: (audience: any, e?: any) => any;
  onToggleShowTextContent?: () => void;
  [x: string]: any;
}

const _CollapsibleText: FC<CollapsibleTextProps> = ({
  testID,
  style,
  content,
  mentions,
  limitLength = 120,
  shortLength = 120,
  toggleOnPress,
  useMarkdown,
  useMarkdownIt,
  limitMarkdownTypes,
  parentCommentId,
  copyEnabled,
  BottomRightComponent,
  isTracking,
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
  let _content = shortContent;
  if (!shortContent || contentShowAll) {
    _content = content;
  }
  const escapeMarkDownContent = useMemo(() => escapeMarkDown(content), [content]);

  const textTestID = parentCommentId
    ? 'collapsible_text.level_2.content'
    : 'collapsible_text.level_1.content';

  const _onToggleShowTextContent = useCallback(() => {
    const toggleContentShowAll = !contentShowAll;
    setContentShowAll(toggleContentShowAll);
    onToggleShowTextContent?.();

    // tracking event
    if (toggleContentShowAll && isTracking) {
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.POST,
        action: TrackingEventContentReadAction.SEE_MORE,
      };
      trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
    }
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

  const renderContentWithMarkdown = useCallback(() => (
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
          value={_content}
          mentions={mentions}
          textTestID={textTestID}
          limitMarkdownTypes={limitMarkdownTypes}
          onPressAudience={onPressAudience}
        />
      )}
      {renderShortContent()}
    </View>
  ), [mentions, _content]);

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
  const disabled = !(onPress || (toggleOnPress && shortContent));

  return (
    <WrapperComponent
      testID={testID}
      activeOpacity={0.6}
      content={escapeMarkDownContent}
      disabled={disabled}
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

function propsAreEqual(
  prev: any, next: any,
) {
  return isEqual(
    prev, next,
  );
}

const CollapsibleText = memo(_CollapsibleText, propsAreEqual);
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
