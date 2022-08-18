import React, { FC, useEffect, useState } from 'react';
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
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import groupApi from '~/api/GroupApi';

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

  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const getMemberWillMove = async (communityId: string, param: any) => {
    try {
      const response = await groupApi.checkMembersCommunityStructureMovePreview(communityId, param);
      const moveMemberCount = response?.data?.moveMemberCount || 0;
      return Promise.resolve(moveMemberCount);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const renderAlertContent = (number: number) => {
    const content = t(
      'communities:group_structure:text_desc_confirm_move_group',
    )
      .replaceAll('%MOVING_NAME%', initGroup?.name)
      .replaceAll('%TARGET_NAME%', selecting?.name);
    return (
      <Text.BodyM style={styles.alertContent}>
        <Text.BodyMMedium>{`${number || userCount || 0} ${t('groups:text_members_other')}`}</Text.BodyMMedium>
        {content}
      </Text.BodyM>
    )
  }

  const onPressSave = async () => {
    setErrorMessage('');
    if (communityId && groupId && selecting?.id) {
      getMemberWillMove(communityId, { groupId, targetId: selecting.id }).then((moveMemberCount:number) => {
        const title = t(
          'communities:group_structure:text_title_confirm_move_group',
        )
          .replaceAll('%MOVING_NAME%', initGroup?.name)
          .replaceAll('%TARGET_NAME%', selecting?.name);
        dispatch(
          modalActions.showAlert({
            title,
            children: renderAlertContent(moveMemberCount),
            cancelBtn: true,
            cancelLabel: t('common:btn_confirm'),
            confirmLabel: t('common:btn_cancel'),
            onCancel: () => {
              dispatch(
                groupsActions.putGroupStructureMoveToTarget({
                  communityId,
                  moveId: groupId,
                  targetId: selecting.id,
                }),
              );
            },
            onConfirm: () => {},
          }),
        );
      }).catch((err:any) => {
        if (!!err?.meta?.message) {
          setErrorMessage(err.meta.message);
        }
      });
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
        { !!errorMessage
          && <Text.H6 color={theme.colors.red40} style={styles.errorMessage}>{errorMessage}</Text.H6>}
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
    alertContent: {
      marginHorizontal: spacing.margin.large,
    },
    errorMessage: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.big,
    },
  });
};

export default MoveGroup;
