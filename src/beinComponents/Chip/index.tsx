import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import commonActions, {IAction} from '~/constants/commonActions';
import {ITheme} from '~/theme/interfaces';
import HorizontalView from '~/components/layout/HorizontalView';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';

interface ChipProps {
  style?: StyleProp<ViewStyle>;
  onActionPress: (action: IAction) => void;
}

const Chip: React.FC<ChipProps> = ({style, onActionPress}: ChipProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();

  return (
    <TouchableOpacity
      onPress={() => onActionPress(commonActions.scrollToBottom as IAction)}>
      <View style={[styles.container, style]}>
        <HorizontalView>
          <Text style={styles.text}>{t('badge:scroll_bottom')}</Text>
          <Icon icon="ArrowDown" size={24} tintColor={theme.colors.primary7} />
        </HorizontalView>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      width: 143,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      borderWidth: 1,
      borderRadius: 22,
      borderColor: colors.primary3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
    text: {
      color: colors.primary7,
    },
  });
};

export default Chip;
