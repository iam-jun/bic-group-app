import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {IPermission, IRole} from '~/interfaces/IGroup';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

export interface PermissionItemProps {
  permission: IPermission;
  role: IRole;
  roleIndex: number;
  onPress?: (permission: IPermission, roleIndex: number) => void;
  isChecked?: boolean;
  isInherited?: boolean;
  inheritedRoleName?: string;
  isFixed?: boolean;
  isFixedForCreator?: boolean;
}

const PermissionItem: FC<PermissionItemProps> = ({
  permission,
  role,
  roleIndex,
  onPress,
  isChecked,
  isInherited,
  inheritedRoleName,
  isFixed,
  isFixedForCreator,
}: PermissionItemProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyle(theme);

  const {restrictedRoles = [], name = ''} = permission;

  const isRestricted = restrictedRoles?.includes?.(role.type || '');

  const _onPress = () => {
    onPress?.(permission, roleIndex);
  };

  let icon: any = 'iconCheckboxUnselected';
  if (isInherited) {
    icon = 'iconCheckboxInherited';
  } else if (isChecked) {
    icon = 'iconCheckboxSelected';
  } else if (isRestricted) {
    icon = 'iconCheckboxRestricted';
  }

  if (isRestricted) {
    return null;
  }

  return (
    <View style={styles.permissionItem}>
      <View style={{flex: 1}}>
        <Text style={styles.permissionName}>{`${name}${
          isFixed
            ? ` (${t('communities:permission:text_fixed_role')})`
            : isFixedForCreator
            ? ` (${t('communities:permission:text_fixed_for_creator')})`
            : ''
        }`}</Text>
      </View>
      {onPress && (
        <Button disabled={isRestricted || isInherited} onPress={_onPress}>
          <Icon icon={icon} />
        </Button>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    permissionName: {
      flex: 1,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default PermissionItem;
