import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import {useBaseHook} from '~/hooks';
import InputSchemeInfo from '~/screens/Groups/CreatePermissionScheme/InputSchemeInfo';
import SchemeRoles from '~/screens/Groups/components/SchemeRoles';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import {getNewSchemeFromSystemScheme} from '~/screens/Groups/CreatePermissionScheme/helper';
import {IPermission, IScheme} from '~/interfaces/IGroup';
import CreateSchemeHeader from '~/screens/Groups/CreatePermissionScheme/components/CreateSchemeHeader';
import SelectSchemeRolesView from '~/screens/Groups/CreatePermissionScheme/SelectSchemeRolesView';

export interface CreatePermissionSchemeProps {
  route?: {
    params?: {
      isEdit?: boolean;
      initScheme?: IScheme;
    };
  };
}

const CreatePermissionScheme: FC<CreatePermissionSchemeProps> = ({
  route,
}: CreatePermissionSchemeProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const isEdit = route?.params?.isEdit;
  const initScheme = route?.params?.initScheme;

  const permissionCategories = useKeySelector(
    groupsKeySelector.permission.categories,
  );
  const systemScheme = useKeySelector(
    groupsKeySelector.permission.systemScheme,
  );

  const loading = permissionCategories?.loading || systemScheme?.loading;
  const loadDataFailed =
    !permissionCategories?.loading &&
    !systemScheme?.loading &&
    (!permissionCategories?.data || !systemScheme?.data);

  useEffect(() => {
    if (isEdit && initScheme) {
      dispatch(
        groupsActions.setCreatingScheme({
          data: initScheme,
        }),
      );
    }
    if (!permissionCategories?.data && !permissionCategories?.loading) {
      dispatch(groupsActions.getPermissionCategories());
    }
    if (!systemScheme?.data && !systemScheme?.loading) {
      dispatch(groupsActions.getSystemScheme());
    }
    return () => {
      dispatch(groupsActions.setCreatingScheme());
    };
  }, []);

  useEffect(() => {
    if (systemScheme?.data && !isEdit) {
      const {newScheme, memberRoleIndex} = getNewSchemeFromSystemScheme(
        systemScheme.data,
      );
      dispatch(
        groupsActions.setCreatingScheme({data: newScheme, memberRoleIndex}),
      );
    }
  }, [systemScheme?.data]);

  const onPressPermission = (permission: IPermission, roleIndex: number) => {
    dispatch(
      groupsActions.updateCreatingSchemePermission({permission, roleIndex}),
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator style={styles.loading} />;
    }

    if (loadDataFailed) {
      return (
        <Text style={styles.loading}>{t('common:text_error_message')}</Text>
      );
    }

    return (
      <ScrollView>
        <InputSchemeInfo />
        <SelectSchemeRolesView onPressPermission={onPressPermission} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <CreateSchemeHeader
        loadingData={loading}
        loadDataFailed={loadDataFailed}
        isEdit={isEdit}
      />
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgFocus,
    },
    loading: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default CreatePermissionScheme;
