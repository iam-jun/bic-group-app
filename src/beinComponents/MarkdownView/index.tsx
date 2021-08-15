import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Markdown, {
  emojiDefs,
  emojiShortcuts,
  MarkdownIt,
} from '~/beinComponents/MarkdownView/Markdown/index';
// @ts-ignore
import emojiPlugin from 'markdown-it-emoji';
// @ts-ignore
import blockEmbedPlugin from 'markdown-it-block-embed';

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

  const markdownIt = MarkdownIt({typographer: true})
    .use(blockEmbedPlugin, {
      containerClassName: 'video-embed',
    })
    .use(emojiPlugin, {
      defs: emojiDefs,
      shortcuts: emojiShortcuts,
    });

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
    video: (node: any, children: any, parent: any, styles: any) => {
      // examine the node properties to see what video we need to render
      console.log(node); // expected output of this is in readme.md below this code snip

      return (
        <Text key={node.key} style={styles.video}>
          Return a video component instead of this text component!
        </Text>
      );
    },
    emoji: (node: any, children: any, parent: any, styles: any) => {
      // examine the node properties to see what video we need to render
      console.log(node); // expected output of this is in readme.md below this code snip
      if (!!node.content) {
        return (
          <Text key={node.key} style={styles.emoji}>
            {node.content}
          </Text>
        );
      } else {
        return <Icon icon={node?.markup} />;
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
    emoji: {
      color: 'tomato',
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
