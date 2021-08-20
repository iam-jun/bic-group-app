import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import Markdown, {
  emojiDefs,
  emojiPlugin,
  emojiShortcuts,
  regexPlugin,
  MarkdownIt,
} from '~/beinComponents/MarkdownView/Markdown/index';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {audienceRegex} from '~/constants/commonRegex';
import {IAudience} from '~/interfaces/IPost';
import {createTextStyle} from '~/beinComponents/Text/textStyle';
import {
  blacklistDefault,
  blacklistLimit,
} from '~/beinComponents/MarkdownView/constant';

export interface MarkdownViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  debugPrintTree?: boolean;
  limitMarkdownTypes?: boolean;

  onLinkPress?: (url: string) => boolean;
  onPressAudience?: (audience: IAudience) => void;
}

const MarkdownView: FC<MarkdownViewProps> = ({
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

  const markdownIt = MarkdownIt({typographer: true})
    .use(emojiPlugin, {
      defs: emojiDefs,
      shortcuts: emojiShortcuts,
    })
    .use(regexPlugin, 'audience', audienceRegex, '@')
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
        {children}
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
      top: Platform.OS === 'web' ? 3 : 0,
      paddingHorizontal: 1,
    },
    emojiIcon: {marginTop: Platform.OS === 'web' ? 0 : -3},

    //Regex
    regex_audience: {
      ...textStyles.bodyM,
      color: colors.link,
    },

    // The main container
    body: {...textStyles.body},

    // Headings
    heading1: {...textStyles.h1},
    heading2: {...textStyles.h2},
    heading3: {...textStyles.h3},
    heading4: {...textStyles.h4},
    heading5: {...textStyles.h5},
    heading6: {...textStyles.h6},

    // Horizontal Rule
    hr: {},

    // Emphasis
    strong: {},
    em: {},
    s: {},

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
    code_inline: {},
    code_block: {},
    fence: {},

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
    paragraph: {},
    hardbreak: {},
    softbreak: {},
  });
};

export default MarkdownView;
