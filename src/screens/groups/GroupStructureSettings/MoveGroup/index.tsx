import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import MoveGroupHeaderInfo from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupHeaderInfo';
import MoveGroupTargets from '~/screens/groups/GroupStructureSettings/MoveGroup/components/MoveGroupTargets';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';
import useGroupStructureStore from '../store';
import IGroupStructureState from '../store/Interface';
import Icon from '~/baseComponents/Icon';

export interface MoveGroupProps {
  route: {
    params: {
      group: IGroup;
      communityId: string;
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
  const communityId = route?.params?.communityId;
  const { id: groupId } = initGroup || {};

  const groupStructureActions = useGroupStructureStore((state) => state.actions);

  const {
    loading, targetGroups, movingGroup, selecting, key,
  } = useGroupStructureStore((state:IGroupStructureState) => state.move) || {};

  const getMoveTargets = () => {
    if (communityId && groupId) {
      groupStructureActions.getGroupStructureMoveTargets({ communityId, groupId });
    }
  };

  useEffect(
    () => {
      getMoveTargets();

      return () => {
        groupStructureActions.setGroupStructureMove();
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
    <Text.H4 useI18n>
      communities:group_structure:text_title_confirm_move_group
    </Text.H4>
  );

  const renderAlertContent = (number: number) => {
    const content = t(
      'communities:group_structure:text_desc_confirm_move_group',
    )
      .replaceAll('{0}', selecting?.name);
    return (
      <Text.BodyM style={styles.alertContent}>
        <Text.BodyMMedium>{`${number || 0} ${t('groups:text_members_other')}`}</Text.BodyMMedium>
        {content}
      </Text.BodyM>
    );
  };

  const setLoadingButton = (loading: boolean) => {
    groupStructureActions.setGroupStructureMove({
      loading,
      key,
      targetGroups,
      movingGroup,
    });
  };

  const onPressSave = async () => {
    setErrorMessage('');
    if (communityId && groupId && selecting?.id) {
      const currentSelecting = { ...selecting };
      setLoadingButton(true);
      getMemberWillMove(communityId, { groupId, targetId: selecting.id }).then((moveMemberCount:number) => {
        setLoadingButton(false);
        groupStructureActions.setGroupStructureMoveSelecting(currentSelecting);
        const title = renderAlertTitle();
        dispatch(
          modalActions.showAlert({
            title,
            children: renderAlertContent(moveMemberCount),
            cancelBtn: true,
            confirmLabel: t('common:btn_confirm'),
            cancelLabel: t('common:btn_cancel'),
            onConfirm: () => {
              groupStructureActions.putGroupStructureMoveToTarget({
                communityId,
                moveId: groupId,
                targetId: selecting.id,
              });
            },
          }),
        );
      }).catch((err:any) => {
        setLoadingButton(false);
        groupStructureActions.setGroupStructureMoveSelecting(currentSelecting);
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

  const renderTitleInfo = () => (
    <View style={styles.title}>
      <Icon icon="CircleInfo" tintColor={theme.colors.neutral20} size={18} />
      <Text.BodyS color={theme.colors.neutral40} style={styles.textInfo} useI18n>
        communities:group_structure:text_info_move_group
      </Text.BodyS>
    </View>
  );

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    return (
      <View style={styles.errorView}>
        <Icon icon="CircleExclamationSolid" tintColor={theme.colors.red40} size={16} />
        <Text.BodyS
          color={theme.colors.red40}
          style={styles.errorMessage}
        >
          {errorMessage}
        </Text.BodyS>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:group_structure:title_move_group')}
        onPressButton={onPressSave}
        buttonText="common:btn_save_apply"
        buttonProps={{
          loading,
          disabled: !selecting || !!errorMessage,
          useI18n: true,
          style: { borderWidth: 0 },
          testID: 'move_group.btn_save_apply',
        }}
      />
      <ScrollView>
        {renderTitleInfo()}
        <MoveGroupHeaderInfo group={initGroup} />
        {renderErrorMessage()}
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
    title: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      margin: spacing.margin.large,
      backgroundColor: colors.neutral1,
    },
    textInfo: {
      marginHorizontal: spacing.margin.small,
    },
    alertContent: {
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    errorView: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.big,
      marginHorizontal: spacing.padding.large,
      borderWidth: 1,
      borderColor: colors.red40,
      borderRadius: spacing.borderRadius.small,
      padding: spacing.padding.large,
    },
    errorMessage: {
      marginHorizontal: spacing.margin.small,
    },
    highlightText: {
      color: colors.purple50,
    },
  });
};

export default MoveGroup;
