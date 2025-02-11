import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Text from '~/baseComponents/Text';
import commonActions, { IAction } from '~/constants/commonActions';
import spacing, { margin, padding } from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatter';
import Button from '../Button';
import Emoji from '../Emoji';
import { sizes } from '~/theme/dimension';

interface ReactionProps {
  testId?: string;
  value: number;
  icon: any;
  selected: boolean;
  onActionPress: (action: IAction) => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  disabled?: boolean;
}

const Reaction: React.FC<ReactionProps> = ({
  testId,
  value,
  icon,
  selected,
  onActionPress,
  onLongPress,
  style,
  loading,
  disabled = false,
}: ReactionProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const styles = createStyles(
    theme, selected, loading,
  );

  const _onChangeValue = () => {
    if (!selected) {
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
      disabled={loading || disabled}
      style={[styles.container, style, loading && { opacity: 0.5 }]}
      onPress={_onChangeValue}
      onLongPress={_onLongPress}
    >
      <View
        testID="reaction.children"
        style={styles.emojiContainer}
      >
        <Emoji
          emojiName={icon}
          size={sizes.numberS}
        />
        <Text.NumberS
          testID="reaction.children.text"
          style={styles.text}
          color={selected ? colors.purple50 : colors.neutral40}
        >
          {` ${newValue}`}
        </Text.NumberS>
      </View>

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
    text: {
      marginLeft: margin.tiny,
    },
    indicator: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default Reaction;
