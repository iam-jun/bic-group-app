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
import SchemeRoles from '~/screens/Groups/CreatePermissionScheme/SchemeRoles';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';

export interface CreatePermissionSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const CreatePermissionScheme: FC<CreatePermissionSchemeProps> = ({
  style,
}: CreatePermissionSchemeProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

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
  const creating = false;
  const disableButtonCreate = loading || loadDataFailed;

  useEffect(() => {
    if (!permissionCategories?.data && !permissionCategories?.loading) {
      dispatch(groupsActions.getPermissionCategories());
    }
    if (!systemScheme?.data && !systemScheme?.loading) {
      dispatch(groupsActions.getSystemScheme());
    }
  }, []);

  const onPressCreate = () => {
    console.log(`\x1b[36m🐣️ index onPressCreate\x1b[0m`);
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
        <SchemeRoles />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:permission:title_create_community_scheme')}
        onPressButton={onPressCreate}
        buttonText={'common:btn_create'}
        buttonProps={{
          loading: creating,
          disabled: disableButtonCreate,
          useI18n: true,
          highEmphasis: true,
          style: {borderWidth: 0},
          testID: 'common.btn_create',
        }}
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
