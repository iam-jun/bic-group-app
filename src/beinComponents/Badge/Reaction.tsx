import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';
import NodeEmoji from 'node-emoji';
import {useKeySelector} from '~/hooks/selector';

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
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme, isSelected, loading);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

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

  return (
    <TouchableOpacity
      testID={testId || 'reaction'}
      disabled={!isInternetReachable || loading}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={_onChangeValue}
      onLongPress={_onLongPress}>
      {loading ? (
        <ActivityIndicator
          testID="reaction.indicator"
          color={colors.borderDisable}
          style={styles.indicator}
        />
      ) : (
        <Text.BodySM
          color={isSelected ? colors.primary7 : colors.textPrimary}
          style={styles.text}
          testID="reaction.children">
          <Text.BodySM style={styles.emoji} testID={`reaction.${icon}`}>
            {emoji}
          </Text.BodySM>
          {` ${value}`}
        </Text.BodySM>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (
  theme: ITheme,
  isSelected: boolean,
  loading?: boolean,
) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor:
        isSelected && !loading ? colors.primary2 : colors.placeholder,
      borderWidth: 1,
      borderColor:
        isSelected && !loading ? colors.primary6 : colors.placeholder,
      borderRadius: 6,
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: Platform.OS === 'web' ? 30 : 28,
    },
    emoji: {
      fontSize: Platform.OS === 'web' ? 15 : 13,
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
