import React, { FC, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Icon from '~/baseComponents/Icon';
import PermissionItem from '~/screens/PermissionScheme/CreatePermissionScheme/components/PermissionItem';
import { ICategory, IPermission, IRole } from '~/interfaces/IGroup';
import { permissionRoleSectionHeaderHeight } from '~/theme/dimension';
import { CATEGORY_KEY, ROLE_TYPE } from '~/constants/permissionScheme';
import spacing from '~/theme/spacing';

export interface RoleItemProps {
  categories: ICategory[];
  role: IRole;
  roleIndex: number;
  inheritedRole?: IRole;
  onLayout: (e: any) => void;
  onPressPermission?: (permission: IPermission, roleIndex: number) => void;
  selectedRolesOnly?: boolean;
}

const RoleItem: FC<RoleItemProps> = ({
  categories,
  role,
  roleIndex,
  inheritedRole,
  onLayout,
  onPressPermission,
  selectedRolesOnly,
}: RoleItemProps) => {
  const [isExpand, setIsExpand] = useState(false);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const onPress = () => {
    setIsExpand(!isExpand);
  };

  const keyRoleId = role?.id || `${role?.type}_${role?.scope}`;

  return (
    <View onLayout={onLayout} style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.row}>
        <Text style={styles.roleName}>{role?.name}</Text>
        <Icon icon={isExpand ? 'AngleDown' : 'AngleRight'} />
      </TouchableOpacity>
      {isExpand
        && categories?.map?.((cat: ICategory) => {
          if (
            role?.type === ROLE_TYPE.GROUP_ADMIN
            && cat?.key === CATEGORY_KEY.COMMUNITY
          ) return null;

          return (
            <View key={`role_${keyRoleId}_cat_${cat?.key}`}>
              <Text.ButtonS style={styles.catName}>{cat?.name}</Text.ButtonS>
              {cat?.subCategories?.map((subCat: any) => (
                <View
                  key={`role_${keyRoleId}_cat_${cat?.key}_subCat_${subCat?.key}`}
                >
                  <Text.H5 style={styles.subCatName}>{subCat?.name}</Text.H5>
                  {subCat?.permissions?.map((per: IPermission) => {
                    const isChecked = role?.permissions?.includes(per?.key);
                    const isInherited = inheritedRole?.permissions?.includes(per?.key);
                    const { fixedForRoles = [] } = per;
                    const isFixed = fixedForRoles?.includes?.(role.type);
                    const isFixedForCreator = fixedForRoles?.includes?.(ROLE_TYPE.CREATOR);
                    if (
                      selectedRolesOnly
                      && !isChecked
                      && !isInherited
                      && !isFixed
                      && !isFixedForCreator
                    ) {
                      return null;
                    }
                    return (
                      <PermissionItem
                        key={`role_${keyRoleId}_cat_${cat?.key}_subCat_${subCat?.key}_per_${per?.key}`}
                        permission={per}
                        role={role}
                        roleIndex={roleIndex}
                        onPress={onPressPermission}
                        isChecked={isChecked}
                        isInherited={isInherited}
                        inheritedRoleName={inheritedRole?.name}
                        isFixed={isFixed}
                        isFixedForCreator={isFixedForCreator}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.margin.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: permissionRoleSectionHeaderHeight,
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.gray20,
    },
    roleName: {
      flex: 1,
    },
    catName: {
      textTransform: 'uppercase',
      color: colors.gray50,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.neutral1,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
    },
    subCatName: {
      color: colors.gray50,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
    },
  });
};

export default RoleItem;
