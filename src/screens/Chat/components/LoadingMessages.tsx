import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {getRandomInt} from '~/utils/generator';

const LoadingMessages = () => {
  const count = getRandomInt(1, 3); // lines count

  const renderItem = (index: number) => {
    return (
      <Placeholder
        key={`loading-message-${index}`}
        Animation={Fade}
        style={{
          marginVertical: 6,
          marginHorizontal: 15,
          borderRadius: 4,
        }}
        Left={() => <PlaceholderMedia style={styles.avatar} />}>
        {Array.from(Array(count).keys()).map((item, index) => (
          <PlaceholderLine
            key={`loading-message-line-${index}`}
            style={styles.line}
            width={getRandomInt(3, 9) * 10}
          />
        ))}
      </Placeholder>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from(Array(15).keys()).map((item, index) => renderItem(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  line: {
    marginTop: 1,
    marginLeft: 16,
  },
});

export default LoadingMessages;
