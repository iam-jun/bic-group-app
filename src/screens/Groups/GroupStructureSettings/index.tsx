import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {useRootNavigation} from '~/hooks/navigation';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import {GroupItemProps} from '~/beinComponents/list/items/GroupItem';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import GroupStructureMenu from '~/screens/Groups/GroupStructureSettings/components/GroupStructureMenu';
import groupsActions from '~/screens/Groups/redux/actions';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface GroupStructureSettingsProps {
  style?: StyleProp<ViewStyle>;
}

const GroupStructureSettings: FC<GroupStructureSettingsProps> = ({
  style,
}: GroupStructureSettingsProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {id: communityId} =
    useKeySelector(groupsKeySelector.communityDetail) || {};

  const {data: communityTree, loading} = useKeySelector(
    groupsKeySelector.groupStructure.communityTree,
  );

  useEffect(() => {
    dispatch(groupsActions.getGroupStructureCommunityTree(communityId));
  }, []);

  const getGroup = (id: number) => {
    let group: GroupItemProps = communityTree;
    communityTree?.children?.map?.((g: any) => {
      if (g.id === Number(id)) {
        group = g;
      } else {
        g?.children?.map?.((child: any) => {
          if (child.id === id) {
            group = child;
          }
        });
      }
    });
    return group;
  };

  const onPressMenu = (group: GroupItemProps) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: <GroupStructureMenu group={getGroup(group?.id)} />,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:group_structure:title_group_structure_settings')}
      />
      <ScrollView style={styles.contentContainer}>
        {loading ? (
          <LoadingIndicator style={styles.loading} />
        ) : (
          <FlatGroupItem {...communityTree} onPressMenu={onPressMenu} />
        )}
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
