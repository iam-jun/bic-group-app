import { ExtendedTheme, useTheme } from '@react-navigation/native';
import NodeEmoji from 'node-emoji';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import Text from '~/beinComponents/Text';
import commonActions, { IAction } from '~/constants/commonActions';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatData';

interface ReactionProps {
  testId?: string;
  value: number;
  icon: any;
  selected: boolean;
  onActionPress: (action: IAction) => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disableUpdateState?: boolean;
  loading?: boolean;
}

const Reaction: React.FC<ReactionProps> = ({
  testId,
  value,
  icon,
  selected,
  onActionPress,
  onLongPress,
  style,
  disableUpdateState,
  loading,
}: ReactionProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(
    theme, isSelected, loading,
  );

  useEffect(
    () => {
      setIsSelected(selected);
    }, [selected],
  );

  const emoji = NodeEmoji.find(icon || '')?.emoji || '';

  const _onChangeValue = () => {
    const newValue = !isSelected;

    if (!disableUpdateState) {
      setIsSelected(newValue);
    }

    if (newValue) {
      onActionPress(commonActions.selectEmoji as IAction);
    } else {
      onActionPress(commonActions.unselectEmoji as IAction);
    }
  };

  const _onLongPress = () => {
    onLongPress?.();
  };

  const newValue = formatLargeNumber(value);

  return (
    <TouchableOpacity
      testID={testId || 'reaction'}
      disabled={!isInternetReachable || loading}
      style={[styles.container, style]}
      onPress={_onChangeValue}
      onLongPress={_onLongPress}
    >
      {loading ? (
        <ActivityIndicator
          testID="reaction.indicator"
          color={colors.gray20}
          style={styles.indicator}
        />
      ) : (
        <Text.NumberS
          color={isSelected ? colors.purple50 : colors.neutral40}
          style={styles.text}
          testID="reaction.children"
        >
          <Text.NumberS style={styles.emoji} testID={`reaction.${icon}`}>
            {emoji}
          </Text.NumberS>
          {` ${newValue}`}
        </Text.NumberS>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (
  theme: ExtendedTheme,
  isSelected: boolean,
  loading?: boolean,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor:
        isSelected && !loading ? colors.purple2 : colors.neutral2,
      borderWidth: 1,
      borderColor: isSelected && !loading ? colors.purple50 : colors.neutral2,
      borderRadius: spacing.borderRadius.small,
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: 28,
    },
    emoji: {
      fontSize: 13,
    },
    text: {
      marginBottom: 2,
    },
    indicator: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default Reaction;
