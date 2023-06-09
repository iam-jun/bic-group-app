import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import VerifiedView from '~/components/VerifiedView';
import Text from '~/baseComponents/Text';

interface Props {
    text: string,
    isVerified?: boolean,
    testID?: string,
}

const InlineText = ({
  text, isVerified = true, testID = 'inline_tex',
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const key = useMemo(() => new Date().getTime(), [text]);

  return (
    <View
      key={key}
      style={styles.container}
    >
      <Text.H5 testID={testID} color={colors.neutral}>
        {`${text}`}
        <VerifiedView
          isVerified={isVerified}
          disabled={false}
          placement="bottom"
        />
      </Text.H5>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default InlineText;
