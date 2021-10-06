import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import {avatarSizes} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {getRandomInt} from '~/utils/generator';

const LoadingQuotedMessage = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  return (
    <Placeholder
      style={styles.container}
      Animation={Fade}
      Left={() => (
        <View style={styles.left}>
          <View style={styles.connector} />
          <PlaceholderMedia style={styles.avatar} />
        </View>
      )}>
      <PlaceholderLine style={{marginTop: 0}} width={getRandomInt(3, 7) * 10} />
    </Placeholder>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.base,
    },
    left: {
      flexDirection: 'row',
      marginEnd: spacing.margin.small,
    },
    connector: {
      height: Platform.OS === 'web' ? 18 : '80%',
      width: 20,
      marginLeft: 20,
      borderColor: colors.borderDisable,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopLeftRadius: spacing.borderRadius.small,
    },
    avatar: {
      width: avatarSizes.tiny,
      height: avatarSizes.tiny,
      borderRadius: 100,
    },
  });
};

export default LoadingQuotedMessage;
