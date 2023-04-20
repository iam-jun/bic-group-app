import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import VerifiedView from '~/components/VerifiedView';
import Text from '~/baseComponents/Text';
import useTooltip from '../../../components/Tooltip.tsx/stores';
import spacing from '~/theme/spacing';

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

  const [containerX, setContainerX] = useState(0);
  const [verifiedViewPosition, setVerifiedViewPosition] = useState(null);

  useEffect(() => {
    if (verifiedViewPosition?.width > 0 && containerX > 0) {
      tooltipActions.setViewPosition(screenId, {
        width: verifiedViewPosition?.width,
        x: containerX + (verifiedViewPosition?.x || 0) + spacing.margin.large,
      });
    }
  }, [verifiedViewPosition, containerX]);

  const key = useMemo(() => new Date().getTime(), [text]);

  const handleLayout = (e: any) => {
    setContainerX(e.nativeEvent.layout.x);
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
