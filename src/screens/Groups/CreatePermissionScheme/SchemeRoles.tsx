import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import Icon from '~/beinComponents/Icon';
import RoleItem from '~/screens/Groups/CreatePermissionScheme/components/RoleItem';

export interface SchemeRolesProps {
  style?: StyleProp<ViewStyle>;
}

const SchemeRoles: FC<SchemeRolesProps> = ({style}: SchemeRolesProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const permissionCategories = useKeySelector(
    groupsKeySelector.permission.categories,
  );
  const systemScheme = useKeySelector(
    groupsKeySelector.permission.systemScheme,
  );

  const schemeData = systemScheme?.data || {};
  const {roles = []} = schemeData || {};
  const categories = permissionCategories?.data || [];

  console.log(
    `\x1b[34m🐣️ SchemeRoles SchemeRoles`,
    `${JSON.stringify(schemeData, undefined, 2)}\x1b[0m`,
  );

  const _onPressPermission = (per: any) => {
    console.log(`\x1b[35m🐣️ SchemeRoles _onPressPermission `, per, `\x1b[0m`);
  };

  return (
    <>
      <Text.BodyM
        style={styles.title}
        onLayout={({
          nativeEvent: {
            layout: {y: anchor},
          },
        }) => {
          console.log(`\x1b[36m🐣️ SchemeRoles title anchor: ${anchor}\x1b[0m`);
        }}>
        Edit Roles
      </Text.BodyM>
      {roles?.map?.((role: any, roleIndex: number) => (
        <RoleItem
          key={`role_${role?.id}`}
          categories={categories}
          role={role}
          onLayout={({
            nativeEvent: {
              layout: {y: anchor},
            },
          }: any) => {
            console.log(
              `\x1b[36m🐣️ SchemeRoles role anchor: ${anchor}\x1b[0m`,
            );
          }}
          onPressPermission={_onPressPermission}
        />
      ))}
    </>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    title: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
      marginTop: spacing.margin.small,
    },
    roleName: {
      marginTop: spacing.margin.small,
      backgroundColor: colors.background,
      padding: spacing.padding.large,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.bgFocus,
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

export default SchemeRoles;
