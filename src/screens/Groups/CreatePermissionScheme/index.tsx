import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { cloneDeep } from 'lodash';

import { useDispatch } from 'react-redux';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import { useBaseHook } from '~/hooks';
import InputSchemeInfo from '~/screens/Groups/CreatePermissionScheme/InputSchemeInfo';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import {
  getMemberRoleIndex,
  getNewSchemeFromSystemScheme,
} from '~/screens/Groups/CreatePermissionScheme/helper';
import { IPermission, IScheme } from '~/interfaces/IGroup';
import CreateSchemeHeader from '~/screens/Groups/CreatePermissionScheme/components/CreateSchemeHeader';
import SelectSchemeRolesView from '~/screens/Groups/CreatePermissionScheme/SelectSchemeRolesView';
import RoleHeaderAnimated from '~/screens/Groups/components/RoleHeaderAnimated';
import spacing from '~/theme/spacing';

export interface CreatePermissionSchemeProps {
  route?: {
    params?: {
      isEdit?: boolean;
      initScheme?: IScheme;
      schemeId?: string;
    };
  };
}

const CreatePermissionScheme: FC<CreatePermissionSchemeProps> = ({
  route,
}: CreatePermissionSchemeProps) => {
  const [anchorRole, setAnchorRole] = useState({});
  const translationY = useSharedValue(0);

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const isEdit = route?.params?.isEdit;
  const initScheme = route?.params?.initScheme;
  const schemeId = route?.params?.schemeId;

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail);
  const permissionCategories = useKeySelector(groupsKeySelector.permission.categories);
  const systemScheme = useKeySelector(groupsKeySelector.permission.systemScheme);

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
        dispatch(groupsActions.setCreatingScheme({
          data: cloneDeep(initScheme),
          memberRoleIndex,
        }));

        if (schemeId) {
        /**
         * init group scheme doesn't have field `roles`
         * need to get full detail to edit roles
         */
          dispatch(groupsActions.getGroupScheme({ communityId, schemeId }));
        }
      }
      if (!permissionCategories?.loading) {
        dispatch(groupsActions.getPermissionCategories(schemeId ? 'GROUP' : 'COMMUNITY'));
      }
      if (!systemScheme?.data && !systemScheme?.loading) {
        dispatch(groupsActions.getSystemScheme());
      }
      return () => {
        dispatch(groupsActions.setCreatingScheme());
        dispatch(groupsActions.setGroupScheme());
      };
    }, [],
  );

  useEffect(
    () => {
      if (systemScheme?.data && !isEdit) {
        const { newScheme, memberRoleIndex } = getNewSchemeFromSystemScheme(systemScheme.data);
        dispatch(groupsActions.setCreatingScheme({ data: newScheme, memberRoleIndex }));
      }
    }, [systemScheme?.data],
  );

  const onPressPermission = (
    permission: IPermission, roleIndex: number,
  ) => {
    dispatch(groupsActions.updateCreatingSchemePermission({ permission, roleIndex }));
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
