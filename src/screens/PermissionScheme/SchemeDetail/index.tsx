import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { IScheme } from '~/interfaces/IGroup';
import SchemeRoles from '~/screens/groups/components/SchemeRoles';
import RoleHeaderAnimated from '~/screens/groups/components/RoleHeaderAnimated';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import spacing from '~/theme/spacing';

export interface SchemeDetailProps {
  route?: {
    params?: {
      scheme?: IScheme;
    };
  };
}

const SchemeDetail: FC<SchemeDetailProps> = ({
  route,
}: SchemeDetailProps) => {
  const [anchorRole, setAnchorRole] = useState({});
  const translationY = useSharedValue(0);

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const permissionCategories = useKeySelector(groupsKeySelector.permission.categories);
  const { loading } = permissionCategories || {};

  const initScheme = route?.params?.scheme;
  const { name, roles } = initScheme || {};

  useEffect(
    () => {
      if (!permissionCategories?.loading) {
        dispatch(groupsActions.getPermissionCategories());
      }
    }, [],
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const onAnchorRole = (
    i: number, role: any, anchor: number,
  ) => {
    setAnchorRole({ ...anchorRole, [i]: { role, anchor } });
  };

  return (
    <View style={styles.container}>
      <Header style={{ zIndex: 2 }} title={name} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.ScrollView
            scrollEventThrottle={1}
            onScroll={scrollHandler}
            contentContainerStyle={styles.contentContainer}
          >
            <SchemeRoles
              roles={roles || []}
              onAnchorRole={onAnchorRole}
              selectedRolesOnly
              useRoleInherited={false}
            />
          </Animated.ScrollView>
          <RoleHeaderAnimated
            sharedValue={translationY}
            anchorRole={anchorRole}
          />
        </View>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 1,
      backgroundColor: colors.gray5,
    },
    contentContainer: {
      paddingBottom: spacing.padding.small,
    },
  });
};

export default SchemeDetail;
