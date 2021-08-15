import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import Markdown, {
  emojiDefs,
  emojiPlugin,
  emojiShortcuts,
  MarkdownIt,
} from '~/beinComponents/MarkdownView/Markdown/index';
// @ts-ignore
// import createRegexPlugin from '~/beinComponents/MarkdownView/regexp';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';

export interface MarkdownViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  debugPrintTree?: boolean;
}

const MarkdownView: FC<MarkdownViewProps> = ({
  style,
  children,
  debugPrintTree,
}: MarkdownViewProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  if (typeof children !== 'string') {
    console.log(`\x1b[31m🐣️ MarkdownView content is not a string\x1b[0m`);
    return null;
  }

  // const regexPlugin = createRegexPlugin(
  //   // regexp to match
  //   /@(\w+)/,
  //
  //   // this function will be called when something matches
  //   function (match: any, utils: any) {
  //     const url = 'http://example.org/u/' + match[1];
  //
  //     return (
  //       '<a href="' + utils.escape(url) + '">' + utils.escape(match[1]) + '</a>'
  //     );
  //   },
  // );

  const markdownIt = MarkdownIt({typographer: true}).use(emojiPlugin, {
    defs: emojiDefs,
    shortcuts: emojiShortcuts,
  });
  // .use(regexPlugin);

  const rules = {
    link: (node: any, children: any, parent: any, styles: any) => {
      return (
        <Text
          key={node.key}
          style={styles.link}
          onPress={() => alert('onPressLink: ' + node.attributes.href)}>
          {children}
        </Text>
      );
    },
    emoji: (node: any, children: any, parent: any, styles: any) => {
      if (!!node.content) {
        return (
          <Text key={node.key} style={styles.emojiText}>
            {node.content}
          </Text>
        );
      } else {
        return (
          <View style={styles.emojiContainer}>
            <Icon style={styles.emojiIcon} size={16} icon={node?.markup} />
          </View>
        );
      }
    },
  };

  const markdownStyles = {
    link: {
      color: 'green',
    },
    video: {
      color: 'red',
    },
    emojiText: {},
    emojiContainer: {
      height: 10,
      top: Platform.OS === 'web' ? 3 : 0,
      paddingHorizontal: 1,
    },
    emojiIcon: {
      marginTop: Platform.OS === 'web' ? 0 : -3,
    },
  };

  if (debugPrintTree) {
    const html = markdownIt.render(children);
    const astTree = markdownIt.parse(children, {});
    console.log(`\x1b[34m🐣️ html :`, html, `\x1b[0m`);
    console.log(`\x1b[35m🐣️ astTree :`, astTree, `\x1b[0m`);
  }

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Markdown
        style={markdownStyles}
        rules={rules}
        markdownit={markdownIt}
        debugPrintTree={debugPrintTree}>
        {children}
      </Markdown>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default MarkdownView;
