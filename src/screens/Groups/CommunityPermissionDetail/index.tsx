import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {IScheme} from '~/interfaces/IGroup';
import SchemeRoles from '~/screens/Groups/components/SchemeRoles';
import RoleHeaderAnimated from '~/screens/Groups/components/RoleHeaderAnimated';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import {useDispatch} from 'react-redux';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

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
  const [anchorRole, setAnchorRole] = useState({});
  const translationY = useSharedValue(0);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const permissionCategories = useKeySelector(
    groupsKeySelector.permission.categories,
  );
  const {loading} = permissionCategories || {};

  const initScheme = route?.params?.scheme;
  const {name, roles} = initScheme || {};

  useEffect(() => {
    if (!permissionCategories?.data && !permissionCategories?.loading) {
      dispatch(groupsActions.getPermissionCategories());
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });

  const onAnchorRole = (i: number, role: any, anchor: number) => {
    setAnchorRole({...anchorRole, [i]: {role, anchor}});
  };

  return (
    <View style={styles.container}>
      <Header style={{zIndex: 2}} title={name} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <View style={{flex: 1}}>
          <Animated.ScrollView
            scrollEventThrottle={1}
            onScroll={scrollHandler}
            contentContainerStyle={styles.contentContainer}>
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

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 1,
      backgroundColor: colors.bgHover,
    },
    contentContainer: {
      paddingBottom: spacing.padding.small,
    },
  });
};

export default CommunityPermissionDetail;
