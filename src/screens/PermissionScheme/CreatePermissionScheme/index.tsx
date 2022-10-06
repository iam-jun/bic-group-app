import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { cloneDeep } from 'lodash';

import { useBaseHook } from '~/hooks';
import InputSchemeInfo from '~/screens/PermissionScheme/CreatePermissionScheme/components/InputSchemeInfo';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import {
  getMemberRoleIndex,
  getNewSchemeFromSystemScheme,
} from '~/screens/PermissionScheme/CreatePermissionScheme/helper';
import { IPermission, IScheme } from '~/interfaces/IGroup';
import CreateSchemeHeader from '~/screens/PermissionScheme/CreatePermissionScheme/components/CreateSchemeHeader';
import SelectSchemeRolesView from '~/screens/PermissionScheme/CreatePermissionScheme/components/SelectSchemeRolesView';
import RoleHeaderAnimated from '~/screens/groups/components/RoleHeaderAnimated';
import spacing from '~/theme/spacing';
import usePermissionSchemeStore from '../store';

export interface CreatePermissionSchemeProps {
  route?: {
    params?: {
      isEdit?: boolean;
      initScheme?: IScheme;
      schemeId?: string;
      communityId: string;
    };
  };
}

const CreatePermissionScheme: FC<CreatePermissionSchemeProps> = ({
  route,
}: CreatePermissionSchemeProps) => {
  const [anchorRole, setAnchorRole] = useState({});
  const translationY = useSharedValue(0);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const isEdit = route?.params?.isEdit;
  const initScheme = route?.params?.initScheme;
  const schemeId = route?.params?.schemeId;
  const communityId = route?.params?.communityId;

  const permissionCategories = usePermissionSchemeStore((state) => state.categories);
  const actions = usePermissionSchemeStore((state) => state.actions);
  const systemScheme = usePermissionSchemeStore((state) => state.systemScheme);

  const loading = permissionCategories?.loading || systemScheme?.loading;
  const loadDataFailed = !permissionCategories?.loading
    && !systemScheme?.loading
    && (!permissionCategories?.data || !systemScheme?.data);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const onAnchorRole = (
    i: number, role: any, anchor: number,
  ) => {
    setAnchorRole({ ...anchorRole, [i]: { role, anchor } });
  };

  useEffect(
    () => {
      if (isEdit && initScheme) {
        const memberRoleIndex = getMemberRoleIndex(cloneDeep(initScheme));
        actions.setCreatingScheme({
          data: cloneDeep(initScheme),
          memberRoleIndex,
        });

        if (schemeId) {
        /**
         * init group scheme doesn't have field `roles`
         * need to get full detail to edit roles
         */
          actions.getGroupScheme({ communityId, schemeId });
        }
      }
      if (!permissionCategories?.loading) {
        actions.getPermissionCategories(schemeId ? 'GROUP' : 'COMMUNITY');
      }
      if (!systemScheme?.data && !systemScheme?.loading) {
        actions.getSystemScheme();
      }
      return () => {
        actions.resetToInitState('creatingScheme');
        actions.resetToInitState('groupScheme');
      };
    }, [],
  );

  useEffect(
    () => {
      if (systemScheme?.data && !isEdit) {
        const { newScheme, memberRoleIndex } = getNewSchemeFromSystemScheme(systemScheme.data);
        actions.setCreatingScheme({ data: newScheme, memberRoleIndex });
      }
    }, [systemScheme?.data],
  );

  const onPressPermission = (
    permission: IPermission, roleIndex: number,
  ) => {
    actions.updateCreatingSchemePermission({ permission, roleIndex });
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
      <View style={{ flex: 1 }}>
        <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler}>
          <InputSchemeInfo />
          <SelectSchemeRolesView
            onPressPermission={onPressPermission}
            onAnchorRole={onAnchorRole}
          />
        </Animated.ScrollView>
        <RoleHeaderAnimated
          sharedValue={translationY}
          anchorRole={anchorRole}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CreateSchemeHeader
        initScheme={initScheme}
        loadingData={loading}
        loadDataFailed={loadDataFailed}
        isEdit={isEdit}
        schemeId={schemeId}
        communityId={communityId}
      />
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray20,
    },
    loading: {
      textAlign: 'center',
      color: colors.gray50,
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default CreatePermissionScheme;
