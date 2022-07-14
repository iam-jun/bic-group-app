// @ts-ignore
import mark from 'markdown-it-mark';
import React, {FC, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {
  blacklistDefault,
  blacklistLimit,
} from '~/beinComponents/MarkdownView/constant';
import Markdown, {
  emojiDefs,
  emojiPlugin,
  emojiShortcuts,
  MarkdownIt,
  regexPlugin,
} from '~/beinComponents/MarkdownView/Markdown/index';
import Text from '~/beinComponents/Text';
import {createTextStyle} from '~/beinComponents/Text/textStyle';
import {audienceRegex} from '~/constants/commonRegex';
import {IMarkdownAudience} from '~/interfaces/IPost';
import {sizes} from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';

export interface MarkdownViewProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  debugPrintTree?: boolean;
  limitMarkdownTypes?: boolean;

  onLinkPress?: (url: string) => boolean;
  onPressAudience?: (audience: IMarkdownAudience, e?: any) => void;
}

const _MarkdownView: FC<MarkdownViewProps> = ({
  testID,
  style,
  children,
  debugPrintTree,
  limitMarkdownTypes,
  onLinkPress,
}: MarkdownViewProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  if (typeof children !== 'string') {
    // console.log(`\x1b[31m🐣️ MarkdownView content is not a string\x1b[0m`);
    return null;
  }

  const _children = children;

  const markdownIt = MarkdownIt({typographer: false, linkify: true})
    .use(mark, {})
    .use(emojiPlugin, {
      defs: emojiDefs,
      shortcuts: emojiShortcuts,
    })
    .use(regexPlugin, 'audience', audienceRegex, '@')
    .use(regexPlugin, 'linebreak', /<br>/, '<')
    .disable(limitMarkdownTypes ? blacklistLimit : blacklistDefault);

  if (debugPrintTree) {
    const html = markdownIt.render(children);
    const astTree = markdownIt.parse(children, {});
    console.log(`\x1b[34m🐣️ html :`, html, `\x1b[0m`);
    console.log(`\x1b[35m🐣️ astTree :`, astTree, `\x1b[0m`);
  }

  const rules = {
    emoji: (node: any, children: any, parent: any, styles: any) => {
      if (!!node.content) {
        return (
          <Text key={node.key} style={styles.emojiText}>
            {node.content}
          </Text>
        );
      } else {
        return (
          <View key={node.key} style={styles.emojiContainer}>
            <Icon style={styles.emojiIcon} size={16} icon={node?.markup} />
          </View>
        );
      }
    },
    regex_linebreak: (node: any) => {
      return <Text key={node.key}>{'\n'}</Text>;
    },
    mark: (node: any, children: any, parent: any, styles: any) => {
      return (
        <Text key={node.key} style={styles.mark}>
          {children}
        </Text>
      );
    },
  };

  return (
    <View testID={testID} style={style}>
      <Markdown
        mergeStyle
        style={styles}
        rules={rules}
        onLinkPress={onLinkPress}
        markdownit={markdownIt}
        debugPrintTree={debugPrintTree}>
        {_children}
      </Markdown>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const textStyles = createTextStyle(theme);
  const {colors, spacing} = theme;
  return StyleSheet.create({
    // Emoji
    emojiText: {},
    emojiContainer: {
      height: 10,
      top: 0,
      paddingHorizontal: 1,
    },
    emojiIcon: {marginTop: -3},

    regex_linebreak: {},
    mark: {
      backgroundColor: '#F6EF79',
      borderRadius: 6,
      overflow: 'hidden',
    },

    // The main container
    body: {...textStyles.bodyM},

    // Headings
    heading1: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h3,
    },
    heading2: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h4,
    },
    heading3: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
    },
    heading4: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
    },
    heading5: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
    },
    heading6: {
      fontFamily: fontFamilies.BeVietnamProSemiBold,
      fontSize: sizes.h5,
    },

    // Horizontal Rule
    hr: {},

    // Emphasis
    strong: {
      ...textStyles.bodyM,
    },
    em: {},
    s: {
      ...textStyles.bodyM,
    },

    // Blockquotes
    blockquote: {},

    // Lists
    bullet_list: {},
    ordered_list: {},
    list_item: {},
    // @pseudo classes below, does not have a unique render rule
    bullet_list_icon: {},
    bullet_list_content: {},
    ordered_list_icon: {},
    ordered_list_content: {},

    // Code
    code_inline: {
      ...textStyles.code,
      backgroundColor: colors.borderDivider,
    },
    code_block: {
      ...textStyles.code,
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      borderColor: colors.borderDisable,
      backgroundColor: colors.borderDivider,
      padding: spacing.padding.base,
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
    },
    fence: {
      ...textStyles.code,
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      borderColor: colors.borderDisable,
      backgroundColor: colors.borderDivider,
      padding: spacing.padding.base,
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
    },

    // Tables
    table: {},
    thead: {},
    tbody: {},
    th: {},
    tr: {},
    td: {},

    // Links
    link: {color: colors.link},
    blocklink: {},

    // Images
    image: {},

    // Text Output
    text: {},
    textgroup: {},
    paragraph: {
      marginTop: 2,
      marginBottom: 2,
    },
    hardbreak: {},
    softbreak: {},
  });
};

const MarkdownView = memo(_MarkdownView);
MarkdownView.whyDidYouRender = true;
export default MarkdownView;
