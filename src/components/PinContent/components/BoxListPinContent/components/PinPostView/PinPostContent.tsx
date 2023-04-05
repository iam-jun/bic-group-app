import React from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from '~/beinComponents/Markdown';

const limitLength = 272;
const shortLength = 272;

interface PinPostContentProps {
    data: string;
    mentions?: any;
}

const PinPostContent: React.FC<PinPostContentProps> = ({
  data,
  mentions,
}) => {
  const shortContent = getShortContent(data, limitLength, shortLength);
  const _content = data?.length < limitLength ? data : shortContent;

  return (
    <View style={styles.container}>
      <Markdown
        value={_content}
        mentions={mentions}
        limitMarkdownTypes
      />
      <View style={styles.mask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default PinPostContent;

const getShortContent = (content: string, limitLength: number, shortLength: number) => {
  if (!content) return '';

  if (content && content.length > limitLength) {
    return `${content.substring(
      0, shortLength,
    )}...`;
  }
  return '';
};
