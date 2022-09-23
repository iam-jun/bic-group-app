import React from 'react';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { View, StyleSheet } from 'react-native';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import BottomSheet from '~/baseComponents/BottomSheet';
import { useMyPermissions } from '~/hooks/permissions';
import useAuth from '~/hooks/auth';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Text from '~/beinComponents/Text';
import useRemoveCommunityMemberStore from '../store';

interface MemberOptionsMenuProps {
  communityId: string;
  modalizeRef: any;
  selectedMember: ICommunityMembers;
  onOptionsClosed: () => void;
}

const MemberOptionsMenu = ({
  communityId,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: MemberOptionsMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const styles = createStyles();
  const { user } = useAuth();
  const { t } = useBaseHook();
  const deleteRemoveCommunityMember = useRemoveCommunityMemberStore(
    (state) => state.actions.deleteRemoveCommunityMember,
  );

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canRemoveMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
  );

  const onPressMenuOption = (type: 'set-admin' | 'remove-admin' | 'remove-member') => {
    modalizeRef.current?.close();
    switch (type) {
      case 'remove-member':
        onPressRemoveMember();
        break;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const onConfirmRemoveMember = () => {
    if (selectedMember?.id) {
      deleteRemoveCommunityMember({ communityId, userId: selectedMember.id });
    }
  };

  const onPressRemoveMember = () => {
    dispatch(modalActions.showAlert({
      title: t('communities:modal_confirm_remove_member:title'),
      content: t('communities:modal_confirm_remove_member:content'),
      confirmLabel: t('communities:modal_confirm_remove_member:button_remove'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveMember,
    }));
  };

  const renderItem = ({ content, testID, onPress }: {content: string; testID?: string; onPress: () => void}) => (
    <Button onPress={onPress}>
      <Text.BodyM
        testID={testID}
        color={colors.neutral40}
        style={styles.menuOption}
        useI18n
      >
        {content}
      </Text.BodyM>
    </Button>
  );

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      onClose={onOptionsClosed}
      ContentComponent={(
        <View>
          {canRemoveMember && selectedMember?.username !== user?.username && (
            renderItem({
              testID: 'member_options_menu.remove_member',
              content: 'groups:member_menu:label_remove_member',
              onPress: () => onPressMenuOption('remove-member'),
            })
          )}
        </View>
      )}
    />
  );
};

const createStyles = () => StyleSheet.create({
  menuOption: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
  },
});

export default MemberOptionsMenu;
