import React from 'react';
import {StyleProp, StyleSheet, View, ViewProps} from 'react-native';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Checkbox from '~/beinComponents/SelectionControl/Checkbox';
import Toggle from '~/beinComponents/SelectionControl/Toggle';
import {IAction} from '~/constants/commonActions';

export interface PrimaryItemProps {
  style?: StyleProp<ViewProps>;
  title?: string;
  subTitle?: string;
  leftIcon?: any;
  onPressCheckbox?: (action: IAction) => void;
  onPressToggle?: (action: IAction) => void;
  onPressEdit?: () => void;
  onPressMenu?: () => void;
  RightComponent?: any;
}

const PrimaryItem: React.FC<PrimaryItemProps> = ({
  style,
  title,
  subTitle,
  leftIcon,
  onPressToggle,
  onPressCheckbox,
  onPressEdit,
  onPressMenu,
  RightComponent,
}: PrimaryItemProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {!!leftIcon && (
        <Icon size={14} style={styles.iconMarginRight} icon={leftIcon} />
      )}
      <View style={styles.contentContainer}>
        {!!title && <Text.H6 numberOfLines={2}>{title}</Text.H6>}
        {!!subTitle && <Text.Body numberOfLines={2}>{subTitle}</Text.Body>}
      </View>
      {onPressCheckbox && (
        <Checkbox
          style={styles.iconMarginLeft}
          onActionPress={onPressCheckbox}
        />
      )}
      {onPressToggle && (
        <Toggle style={styles.iconMarginLeft} onActionPress={onPressToggle} />
      )}
      {onPressEdit && (
        <Icon
          style={styles.iconMarginLeft}
          icon={'Edit'}
          onPress={onPressEdit}
        />
      )}
      {onPressMenu && (
        <Icon
          style={styles.iconMarginLeft}
          onPress={onPressMenu}
          icon={'EllipsisV'}
        />
      )}
      {RightComponent}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: dimension?.primaryItemHeight,
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
    contentContainer: {flex: 1},
    iconMarginRight: {
      marginRight: spacing?.margin.extraLarge,
    },
    iconMarginLeft: {
      marginLeft: spacing?.margin.extraLarge,
    },
  });
};

export default PrimaryItem;
