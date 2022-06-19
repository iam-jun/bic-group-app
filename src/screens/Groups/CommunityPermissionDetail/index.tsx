import React, {FC} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {IScheme} from '~/interfaces/IGroup';
import SchemeRoles from '~/screens/Groups/components/SchemeRoles';

export interface CommunityPermissionDetailProps {
  route?: {
    params?: {
      scheme?: IScheme;
    };
  };
}

const CommunityPermissionDetail: FC<CommunityPermissionDetailProps> = ({
  route,
}: CommunityPermissionDetailProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const initScheme = route?.params?.scheme;
  const {name, roles} = initScheme || {};

  return (
    <View style={styles.container}>
      <Header title={name} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SchemeRoles roles={roles || []} selectedRolesOnly />
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: spacing.padding.small,
    },
  });
};

export default CommunityPermissionDetail;
