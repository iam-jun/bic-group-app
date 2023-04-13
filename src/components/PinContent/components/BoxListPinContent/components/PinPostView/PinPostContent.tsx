import React from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from '~/beinComponents/Markdown';

interface PinPostContentProps {
    data: string;
    mentions?: any;
}

const PinPostContent: React.FC<PinPostContentProps> = ({
  data,
  mentions,
}) => {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <Markdown
        value={data}
        mentions={mentions}
        limitMarkdownTypes
        paragraphStyles={styles.paragraph}
      />
      <View style={styles.mask} />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  paragraph: {
    marginBottom: 0,
  },
});

export default PinPostContent;
