import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { IPermission, IRole } from '~/interfaces/IGroup';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import Checkbox from '~/beinComponents/Checkbox';

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
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { restrictedRoles = [], name = '' } = permission;

  const isRestricted = restrictedRoles?.includes?.(role.type || '');

  const _onPress = () => {
    onPress?.(permission, roleIndex);
  };

  if (isRestricted) return null;

  return (
    <View style={styles.permissionItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.permissionName}>
          {`${name}${
            isFixed
              ? ` (${t('communities:permission:text_fixed_role')})`
              : isFixedForCreator
                ? ` (${t('communities:permission:text_fixed_for_creator')})`
                : ''
          }`}
        </Text>
      </View>
      {onPress && (
        <Checkbox
          isChecked={isChecked}
          disabled={isInherited ? 'disabled-auto-selected' : undefined}
          onPress={_onPress}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
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
