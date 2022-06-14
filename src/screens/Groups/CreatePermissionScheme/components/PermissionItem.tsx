import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {IPermission} from '~/interfaces/IGroup';

export interface PermissionItemProps {
  permission: IPermission;
  onPress?: (permission: IPermission) => void;
}

const PermissionItem: FC<PermissionItemProps> = ({
  permission,
  onPress,
}: PermissionItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const _onPress = () => {
    onPress?.(permission);
  };

  const icon = 'iconCheckboxUnselected';

  return (
    <View style={styles.permissionItem}>
      <Text style={styles.permissionName}>{permission?.name}</Text>
      {onPress && (
        <Button onPress={_onPress}>
          <Icon icon={icon} />
        </Button>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    permissionName: {
      flex: 1,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default PermissionItem;
