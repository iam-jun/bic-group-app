import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ContentQuizItemProps {}

const ContentQuizItem: React.FC<ContentQuizItemProps> = ({  }) => {
  return (
    <View style={styles.container}>
      <Text>ContentQuizItem</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default ContentQuizItem;
