import React, {FC, memo} from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
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
import {IAudience} from '~/interfaces/IPost';
import {fontFamilies} from '~/theme/fonts';

import {ITheme} from '~/theme/interfaces';

export interface MarkdownViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  debugPrintTree?: boolean;
  limitMarkdownTypes?: boolean;

  onLinkPress?: (url: string) => boolean;
  onPressAudience?: (audience: IAudience) => void;
}

const _MarkdownView: FC<MarkdownViewProps> = ({
  style,
  children,
  debugPrintTree,
  limitMarkdownTypes,

  onLinkPress,
  onPressAudience,
}: MarkdownViewProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  if (typeof children !== 'string') {
    // console.log(`\x1b[31m🐣️ MarkdownView content is not a string\x1b[0m`);
    return null;
  }

  const _children = replaceLineBreak(children);

  const markdownIt = MarkdownIt({typographer: true, linkify: true})
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
    regex_audience: (node: any, children: any, parent: any, styles: any) => {
      const match = node.sourceMeta?.match;
      const audience: IAudience = {
        type: match?.[1],
        id: match?.[2],
        name: match?.[3],
      };
      return (
        <Text
          key={node.key}
          style={styles.regex_audience}
          onPress={() => onPressAudience?.(audience)}>
          {audience.name}
        </Text>
      );
    },
    regex_linebreak: (node: any) => {
      return <Text key={node.key}>{'\n'}</Text>;
    },
  };

  return (
    <View style={style}>
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

const replaceLineBreak = (content: string) => {
  if (!content) {
    return '';
  }
  const replacerSplash = (splash: string) => (match: any) => {
    let middle = match.substring(splash.length, match.lastIndexOf(splash));
    if (middle) {
      middle = middle?.replace(new RegExp(splash, 'g'), '<br>');
      return splash + middle + '<br>';
    }
    return '';
  };
  return content
    .replace(/(\r\n)(\r\n)+(\r\n)/g, replacerSplash('\r\n'))
    .replace(/(\n)(\n)+(\n)/g, replacerSplash('\n'))
    .replace(/(\r)(\r)+(\r)/g, replacerSplash('\r'))
    .replace(/\n\n/g, '\n<br>')
    .replace(/\r\r/g, '\r<br>')
    .replace(/\r\n\r\n/g, '\r\n<br>');
};

const createStyle = (theme: ITheme) => {
  const textStyles = createTextStyle(theme);
  const {colors, spacing} = theme;
  return StyleSheet.create({
    // Emoji
    emojiText: {},
    emojiContainer: {
      height: 10,
      top: Platform.OS === 'web' ? 3 : 0,
      paddingHorizontal: 1,
    },
    emojiIcon: {marginTop: Platform.OS === 'web' ? 0 : -3},

    //Regex
    regex_audience: {
      ...textStyles.bodyM,
      color: colors.link,
    },
    regex_linebreak: {},

    // The main container
    body: {...textStyles.body},

    // Headings
    heading1: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 20,
      lineHeight: 32,
    },
    heading2: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 18,
      lineHeight: 32,
    },
    heading3: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 16,
      lineHeight: 28,
    },
    heading4: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 16,
    },
    heading5: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 16,
    },
    heading6: {
      fontFamily: fontFamilies.SegoeSemibold,
      fontSize: 16,
    },

    // Horizontal Rule
    hr: {},

    // Emphasis
    strong: {
      ...textStyles.bodyM,
    },
    em: {
      ...textStyles.bodyI,
    },
    s: {
      ...textStyles.body,
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
