import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {ITheme} from '~/theme/interfaces';
import {getRandomInt} from '~/utils/generator';

const LoadingMessages = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
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

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 3,
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
};

export default LoadingMessages;
