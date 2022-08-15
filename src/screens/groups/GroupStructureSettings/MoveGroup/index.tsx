import React, { FC, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import { IGroup } from '~/interfaces/IGroup';
import MoveGroupHeaderInfo from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupHeaderInfo';
import MoveGroupTargets from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupTargets';
import modalActions from '~/storeRedux/modal/actions';

export interface MoveGroupProps {
  route: {
    params: {
      group: IGroup;
    };
  };
}

const MoveGroup: FC<MoveGroupProps> = ({ route }: MoveGroupProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const initGroup = route?.params?.group;
  const { id: groupId } = initGroup || {};

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail);
  const {
    loading, targetGroups, movingGroup, selecting,
  } = useKeySelector(groupsKeySelector.groupStructure.move) || {};

  const { userCount } = movingGroup || {};

  const getMoveTargets = (key = '') => {
    if (communityId && groupId) {
      dispatch(groupsActions.getGroupStructureMoveTargets({ communityId, groupId, key }));
    }
  };

  useEffect(
    () => {
      getMoveTargets();

      return () => {
        dispatch(groupsActions.setGroupStructureMove());
      };
    }, [],
  );

  const onPressSave = () => {
    if (communityId && groupId && selecting?.id) {
      const title = t(
        'communities:group_structure:text_title_confirm_move_group',
      )
        .replaceAll('%MOVING_NAME%', initGroup?.name)
        .replaceAll('%TARGET_NAME%', selecting?.name);
      const content = t(
        'communities:group_structure:text_desc_confirm_move_group',
      )
        .replaceAll('%COUNT%', userCount || 0)
        .replaceAll('%MOVING_NAME%', initGroup?.name)
        .replaceAll('%TARGET_NAME%', selecting?.name);
      dispatch(
        modalActions.showAlert({
          title,
          content,
          cancelBtn: true,
          cancelLabel: t('common:btn_cancel'),
          confirmLabel: t('common:btn_confirm'),
          onConfirm: () => {
            dispatch(
              groupsActions.putGroupStructureMoveToTarget({
                communityId,
                moveId: groupId,
                targetId: selecting.id,
              }),
            );
          },
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:group_structure:title_move_group')}
        onPressButton={onPressSave}
        buttonText="common:btn_save"
        buttonProps={{
          loading,
          disabled: !selecting,
          useI18n: true,
          highEmphasis: true,
          style: { borderWidth: 0 },
          testID: 'move_group.btn_save',
        }}
      />
      <ScrollView>
        <MoveGroupHeaderInfo group={initGroup} />
        <MoveGroupTargets
          communityId={communityId}
          groupId={groupId}
          targets={targetGroups}
          selecting={selecting}
        />
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
  });
};

export default MoveGroup;
