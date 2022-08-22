import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import NodeEmoji from 'node-emoji';
import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Text from '~/beinComponents/Text';
import commonActions, { IAction } from '~/constants/commonActions';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import spacing, { margin, padding } from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatData';
import Button from '../Button';

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

  let emoji = null;
  const nodeEmoji = NodeEmoji.find(icon || '')?.emoji || '';

  if (nodeEmoji) {
    emoji = (
      <Text.NumberS style={styles.nodeEmoji} testID={`reaction.${icon}`}>
        {nodeEmoji}
      </Text.NumberS>
    )
  }

  if (!emoji) {
    const imageEmoji = STATIC_EMOJI[icon] || ANIMATED_EMOJI[icon];
    if (imageEmoji) {
      emoji = (
        <Image style={styles.emoji} resizeMode="contain" source={imageEmoji} />
      )
    }
  }

  if (!emoji) return null;

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
    <Button
      testID={testId || 'reaction'}
      disabled={loading}
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
        <View
          testID="reaction.children"
          style={styles.emojiContainer}
        >
          {emoji}
          <Text.NumberS
            testID="reaction.children.text"
            style={styles.text}
            color={isSelected ? colors.purple50 : colors.neutral40}
          >
            {` ${newValue}`}
          </Text.NumberS>
        </View>
      )}
    </Button>
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
      paddingHorizontal: padding.xSmall,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: 28,
    },
    emojiContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nodeEmoji: {
      fontSize: 14,
    },
    emoji: {
      width: 14,
      aspectRatio: 1,
    },
    text: {
      marginLeft: margin.tiny,
    },
    indicator: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default Reaction;
