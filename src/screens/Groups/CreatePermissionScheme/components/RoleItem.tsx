import React, {FC, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import PermissionItem from '~/screens/Groups/CreatePermissionScheme/components/PermissionItem';
import {ICategory, IPermission, IRole} from '~/interfaces/IGroup';
import {permissionRoleSectionHeaderHeight} from '~/theme/dimension';

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

  const theme = useTheme() as ITheme;
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
      {isExpand &&
        categories?.map?.((cat: ICategory) => (
          <View key={`role_${keyRoleId}_cat_${cat?.key}`}>
            <Text.ButtonSmall style={styles.catName}>
              {cat?.name}
            </Text.ButtonSmall>
            {cat?.subCategories?.map((subCat: any) => (
              <View
                key={`role_${keyRoleId}_cat_${cat?.key}_subCat_${subCat?.key}`}>
                <Text.H5 style={styles.subCatName}>{subCat?.name}</Text.H5>
                {subCat?.permissions?.map((per: IPermission) => {
                  const isChecked = role?.permissions?.includes(per?.key);
                  const isInherited = inheritedRole?.permissions?.includes(
                    per?.key,
                  );
                  if (selectedRolesOnly && !isChecked && !isInherited) {
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
                    />
                  );
                })}
              </View>
            ))}
          </View>
        ))}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.margin.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: permissionRoleSectionHeaderHeight,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.bgFocus,
    },
    roleName: {
      flex: 1,
    },
    catName: {
      textTransform: 'uppercase',
      color: colors.textSecondary,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderColor: colors.borderDivider,
    },
    subCatName: {
      color: colors.textSecondary,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.background,
    },
  });
};

export default RoleItem;
