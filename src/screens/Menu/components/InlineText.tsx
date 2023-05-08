import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import VerifiedView from '~/components/VerifiedView';
import Text from '~/baseComponents/Text';
import useTooltip from '../../../components/Tooltip.tsx/stores';
import { spacing } from '~/theme';

interface Props {
    text: string,
    screenId: string,
    isVerified?: boolean,
    testID?: string,
}

const InlineText = ({
  text, screenId, isVerified = true, testID = 'inline_tex',
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const tooltipActions = useTooltip((state) => state.actions);

  const [containerPosition, setContainerPosition] = useState(null);
  const [verifiedViewPosition, setVerifiedViewPosition] = useState(null);

  useEffect(() => {
    if (verifiedViewPosition?.width > 0 && containerPosition?.width > 0) {
      const newX = Platform.OS === 'ios' ? ((containerPosition?.x || 0) + (verifiedViewPosition?.x || 0)) + spacing.margin.large
        : ((containerPosition?.x || 0)
        + (containerPosition?.width || 0)
        - (verifiedViewPosition?.x || 0) + spacing.margin.xSmall);
      tooltipActions.setViewPosition(screenId, {
        width: verifiedViewPosition?.width,
        x: newX,
      });
    }
  }, [verifiedViewPosition, containerPosition]);

  const key = useMemo(() => new Date().getTime(), [text]);

  const handleLayout = (e: any) => {
    setContainerPosition(e.nativeEvent.layout);
  };

  const handleVerifiedViewLayout = (e: any) => {
    setVerifiedViewPosition(e?.nativeEvent?.layout);
  };

  const showTooltip = () => {
    tooltipActions.showTooltip(screenId);
  };

  return (
    <View
      key={key}
      style={styles.container}
      onLayout={handleLayout}
    >
      <Text.H5 testID={testID} color={colors.neutral}>
        {`${text} `}
        <VerifiedView
          isVerified={isVerified}
          screenId={screenId}
          onPress={showTooltip}
          onLayout={handleVerifiedViewLayout}
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
