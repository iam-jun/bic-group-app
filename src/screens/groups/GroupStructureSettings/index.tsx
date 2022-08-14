import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import { GroupItemProps } from '~/beinComponents/list/items/GroupItem';
import modalActions from '~/storeRedux/modal/actions';
import GroupStructureMenu from '~/screens/groups/GroupStructureSettings/components/GroupStructureMenu';
import groupsActions from '~/storeRedux/groups/actions';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import { getGroupFromTreeById } from '~/screens/groups/helper';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';

export interface GroupStructureSettingsProps {
  style?: StyleProp<ViewStyle>;
}

const GroupStructureSettings: FC<GroupStructureSettingsProps> = () => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail) || {};

  const { data: communityTree, loading } = useKeySelector(groupsKeySelector.groupStructure.communityTree);

  useEffect(
    () => {
      dispatch(groupsActions.getGroupStructureCommunityTree({ communityId }));
    }, [],
  );

  const onPressMenu = (group: GroupItemProps) => {
    const { communityId, childrenUiIds, level = 0 } = group || {};
    let groupLevel1NoSibling = false;
    if (level === 1 && group?.parents?.[0]) {
      const groupParent = getGroupFromTreeById(
        communityTree, group.parents[0],
      );
      groupLevel1NoSibling = isEmpty(groupParent.children) || groupParent?.children?.length === 1;
    }
    const disableMove = !!communityId || groupLevel1NoSibling;
    const disableReorder = isEmpty(childrenUiIds) || childrenUiIds?.length === 1; // props generated when render UI tree
    const groupFromTree: IGroup = getGroupFromTreeById(
      communityTree,
      group?.id,
    );
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <GroupStructureMenu
          group={groupFromTree}
          disableMove={disableMove}
          disableReorder={disableReorder}
        />
      ),
    }));
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:group_structure:title_group_structure_settings')}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <LoadingIndicator style={styles.loading} />
        ) : (
          communityTree && (
            <FlatGroupItem
              {...communityTree}
              disableOnPressItem
              disableHorizontal
              showInfo={false}
              onPressMenu={onPressMenu}
              iconVariant="tiny"
              nameLines={1}
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    contentContainer: {
      padding: spacing.padding.large,
    },
    loading: {
      marginTop: spacing.margin.large,
    },
  });
};

export default GroupStructureSettings;
