import React, {FC, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import PermissionItem from '~/screens/Groups/CreatePermissionScheme/components/PermissionItem';
import {ICategory, IPermission, IRole} from '~/interfaces/IGroup';

export interface RoleItemProps {
  categories: ICategory[];
  role: IRole;
  onLayout: (e: any) => void;
  onPressPermission?: (permission: IPermission) => void;
}

const RoleItem: FC<RoleItemProps> = ({
  categories,
  role,
  onLayout,
  onPressPermission,
}: RoleItemProps) => {
  const [isExpand, setIsExpand] = useState(false);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPress = () => {
    setIsExpand(!isExpand);
  };

  return (
    <View onLayout={onLayout}>
      <TouchableOpacity onPress={onPress} style={styles.row}>
        <Text style={styles.roleName}>{role?.name}</Text>
        <Icon icon={isExpand ? 'AngleDown' : 'AngleRight'} />
      </TouchableOpacity>
      {isExpand &&
        categories?.map?.((cat: ICategory) => (
          <View key={`role_${role?.id}_cat_${cat?.key}`}>
            <Text.ButtonSmall style={styles.catName}>
              {cat?.name}
            </Text.ButtonSmall>
            {cat?.subCategories?.map((subCat: any) => (
              <View
                key={`role_${role?.id}_cat_${cat?.key}_subCat_${subCat?.key}`}>
                <Text.H5 style={styles.subCatName}>{subCat?.name}</Text.H5>
                {subCat?.permissions?.map((per: IPermission) => (
                  <PermissionItem
                    key={`role_${role?.id}_cat_${cat?.key}_subCat_${subCat?.key}_per_${per?.key}`}
                    permission={per}
                    onPress={onPressPermission}
                  />
                ))}
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
    container: {},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.small,
      backgroundColor: colors.background,
      padding: spacing.padding.large,
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
