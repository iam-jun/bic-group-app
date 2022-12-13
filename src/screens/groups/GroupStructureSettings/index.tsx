import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { GroupItemProps } from '~/beinComponents/list/items/GroupItem';
import modalActions from '~/storeRedux/modal/actions';
import GroupStructureMenu from '~/screens/groups/GroupStructureSettings/components/GroupStructureMenu';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import { getGroupFromTreeById } from '~/screens/groups/helper';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import useGroupStructureStore from './store';
import { isGroup } from '~/helpers/groups';
import { GroupTreeItem } from '~/components/groups';
import useGroupTreeStore from '~/components/groups/store';

export interface GroupStructureSettingsProps {
  style?: StyleProp<ViewStyle>;
  route: any
}

const GroupStructureSettings: FC<GroupStructureSettingsProps> = (props) => {
  const { params } = props.route;
  const communityId = params?.communityId;
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { communityTree, actions } = useGroupStructureStore();
  const { data: dataTree, loading } = communityTree || {};
  const resetGroupTree = useGroupTreeStore((state) => state.reset);

  useEffect(
    () => {
      actions.getGroupStructureCommunityTree({ communityId });

      return () => {
        resetGroupTree();
      };
    }, [],
  );

  const onMenuPress = (group: GroupItemProps) => {
    const { communityId, childrenUiIds, level = 0 } = group || {};
    let groupLevel1NoSibling = false;
    if (level === 1 && group?.parents?.[0]) {
      const groupParent = getGroupFromTreeById(
        dataTree, group.parents[0],
      );
      groupLevel1NoSibling = isEmpty(groupParent.children) || groupParent?.children?.length === 1;
    }
    const disableMove = !isGroup(group) || groupLevel1NoSibling;
    const disableReorder = isEmpty(childrenUiIds) || childrenUiIds?.length === 1; // props generated when render UI tree
    const groupFromTree: IGroup = getGroupFromTreeById(
      dataTree,
      group?.id,
    );
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <GroupStructureMenu
          communityId={communityId}
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
          dataTree && (
            <GroupTreeItem item={dataTree} onMenuPress={onMenuPress} />
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
