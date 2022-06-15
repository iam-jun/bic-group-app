import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {IPermission, IRole} from '~/interfaces/IGroup';

export interface PermissionItemProps {
  permission: IPermission;
  role: IRole;
  roleIndex: number;
  onPress?: (permission: IPermission, roleIndex: number) => void;
  isChecked?: boolean;
  isInherited?: boolean;
}

const PermissionItem: FC<PermissionItemProps> = ({
  permission,
  role,
  roleIndex,
  onPress,
  isChecked,
  isInherited,
}: PermissionItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {restrictedRoles = [], name = ''} = permission;

  const isRestricted = restrictedRoles?.includes?.(role.type || '');

  const _onPress = () => {
    onPress?.(permission, roleIndex);
  };

  let icon: any = 'iconCheckboxUnselected';
  if (isInherited) {
    icon = 'iconCheckboxInherited';
  } else if (isRestricted) {
    icon = 'iconCheckboxRestricted';
  } else if (isChecked) {
    icon = 'iconCheckboxSelected';
  }

  return (
    <View style={styles.permissionItem}>
      <Text style={styles.permissionName}>{name}</Text>
      {onPress && (
        <Button disabled={isRestricted || isInherited} onPress={_onPress}>
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
