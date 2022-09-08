import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import { IGroup } from '~/interfaces/IGroup';
import MoveGroupHeaderInfo from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupHeaderInfo';
import MoveGroupTargets from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupTargets';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import groupApi from '~/api/GroupApi';
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

  const [errorMessage, setErrorMessage] = useState<string>('');

  const initGroup = route?.params?.group;
  const { id: groupId } = initGroup || {};

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail);
  const {
    loading, targetGroups, movingGroup, selecting, key,
  } = useKeySelector(groupsKeySelector.groupStructure.move) || {};

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

  const renderAlertTitle = () => (
    <Text.H4 style={{ flex: 1 }}>
      {t('communities:group_structure:text_title_confirm_move_group')}
      <Text.H4 style={styles.highlightText}>
        {` ${initGroup?.name || ''} `}
      </Text.H4>
      <Text.H4>
        {t('common:text_to')}
      </Text.H4>
      <Text.H4 style={styles.highlightText}>
        {` ${selecting?.name || ''}`}
      </Text.H4>
    </Text.H4>
  );

  const renderAlertContent = (number: number) => {
    const content = t(
      'communities:group_structure:text_desc_confirm_move_group',
    )
      .replaceAll('%MOVING_NAME%', initGroup?.name)
      .replaceAll('%TARGET_NAME%', selecting?.name);
    return (
      <Text.BodyM style={styles.alertContent}>
        <Text.BodyMMedium>{`${number || 0} ${t('groups:text_members_other')}`}</Text.BodyMMedium>
        {content}
      </Text.BodyM>
    );
  };

  const setLoadingButton = (loading: boolean) => {
    dispatch(groupsActions.setGroupStructureMove({
      loading,
      key,
      targetGroups,
      movingGroup,
    }));
  };

  const onPressSave = async () => {
    setErrorMessage('');
    if (communityId && groupId && selecting?.id) {
      const currentSelecting = { ...selecting };
      setLoadingButton(true);
      getMemberWillMove(communityId, { groupId, targetId: selecting.id }).then((moveMemberCount:number) => {
        setLoadingButton(false);
        dispatch(groupsActions.setGroupStructureMoveSelecting(currentSelecting));
        const title = renderAlertTitle();
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onConfirm: () => {},
          }),
        );
      }).catch((err:any) => {
        setLoadingButton(false);
        dispatch(groupsActions.setGroupStructureMoveSelecting(currentSelecting));
        if (!!err?.meta?.message) {
          setErrorMessage(err.meta.message);
        }
      });
    }
  };

  const onPressItem = (item: any) => {
    if (!isEqual(item, selecting)) {
      setErrorMessage('');
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
          disabled: !selecting || !!errorMessage,
          useI18n: true,
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
          onPressItem={onPressItem}
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
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    errorMessage: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.big,
    },
    highlightText: {
      color: colors.purple50,
    },
  });
};

export default MoveGroup;
