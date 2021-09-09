import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '../Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import commonActions, {IAction} from '~/constants/commonActions';

interface ReactionProps {
  value: number;
  icon: any;
  selected: boolean;
  onActionPress: (action: IAction) => void;
  style?: StyleProp<ViewStyle>;
  disableUpdateState?: boolean;
  loading?: boolean;
}

const Reaction: React.FC<ReactionProps> = ({
  value,
  icon,
  selected,
  onActionPress,
  style,
  disableUpdateState,
  loading,
}: ReactionProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme, isSelected);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

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

  return (
    <TouchableOpacity
      disabled={loading}
      style={[styles.container, style]}
      onPress={_onChangeValue}>
      {loading ? (
        <ActivityIndicator
          color={colors.borderDisable}
          style={styles.indicator}
        />
      ) : (
        <>
          <View style={{width: 16, height: 16}}>
            <Icon icon={icon} size={16} />
          </View>
          <Text.BodySM
            color={isSelected ? colors.primary7 : colors.textPrimary}
            style={styles.textInput}>
            {value}
          </Text.BodySM>
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme, isSelected: boolean) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: isSelected ? colors.primary2 : colors.placeholder,
      borderWidth: 1,
      borderColor: isSelected ? colors.primary6 : colors.placeholder,
      borderRadius: 6,
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: 28,
    },
    textInput: {
      marginStart: spacing?.margin.tiny,
      marginBottom: 2,
    },
    indicator: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default Reaction;
