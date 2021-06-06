import React from 'react';
import {default as RNMarkdown, MarkdownIt} from 'react-native-markdown-display';
import {View, Linking, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export interface Props {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  maxLength?: number;
}

const Markdown: React.FC<Props> = ({
  style,
  children,
  maxLength = -1,
  ...props
}) => {
  if (!children || typeof children !== 'string') return null;

  const onLinkPress = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (maxLength > -1 && children.length > maxLength) {
    children = `${children.substr(0, maxLength)}...`;
  }

  const theme: any = useTheme();
  const color = theme.colors.text;

  return (
    <View style={style}>
      <RNMarkdown
        {...props}
        markdownit={MarkdownIt({typographer: true}).disable(['image'])}
        onLinkPress={onLinkPress}
        style={{...styles, text: {color}}}>
        {children}
      </RNMarkdown>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    overflow: 'hidden',
  },
  heading1: {
    fontSize: 22,
  },
  heading2: {
    fontSize: 20,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 14,
  },
  heading6: {
    fontSize: 14,
  },
});

export default Markdown;
