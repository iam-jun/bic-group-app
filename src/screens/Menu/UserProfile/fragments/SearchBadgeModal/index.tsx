import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, {
  FadeInDown, FadeOutUp,
} from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BadgeCollection from '../BadgeCollection';
import useUserBadge from '../BadgeCollection/store';
import { IUserBadge } from '~/interfaces/IEditUser';
import useBaseHook from '~/hooks/baseHook';
import Header from '~/beinComponents/Header';

interface NFSearchBadgesProps {
    showSearchBox?: boolean;
}

const SearchBadgeModal = ({
  showSearchBox = false,
}: NFSearchBadgesProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { t } = useBaseHook();

  const [isOpen, setIsOpen] = useState(false);

  const isEditing = useUserBadge((state) => state.isEditing);
  const showingBadges = useUserBadge((state) => state.showingBadges);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);
  const actions = useUserBadge((state) => state.actions);
  const loadingEditing = useUserBadge((state) => state.loadingEditing);
  const choosingBadgesOrder = useUserBadge((state) => state.choosingBadgesOrder);

  const isChangeInfo = !checkEqual(choosingBadges, showingBadges);
  const isChangeOrder = !isAscendingArray(choosingBadgesOrder);
  const isEnable = !Boolean(showingBadges?.[0]) ? isChangeInfo : Boolean(isChangeInfo || isChangeOrder);

  useEffect(() => {
    actions.resetChoosingBadgesOrder();
  }, []);

  useEffect(() => {
    if (isEditing) { setIsOpen(true); }
  }, [isEditing]);

  const onClose = () => {
    setIsOpen(false);
    actions.cancleSaveBadges();
    actions.resetChoosingBadgesOrder();
  };

  const onPressSave = () => {
    actions.editShowingBadges();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Animated.View
      testID="member_questions.view"
      style={styles.screenContainer}
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <View style={styles.screenContainer}>
        <Header
          title={t('user:edit_showing_badges_title')}
          buttonProps={{ disabled: !isEnable, loading: loadingEditing }}
          buttonText={t('common:btn_save')}
          onPressBack={onClose}
          onPressButton={onPressSave}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
          style={{ flex: 1 }}
        >
          <BadgeCollection showSearchBox={showSearchBox} />
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

const checkEqual = (choosingArr: IUserBadge[], choseArr: IUserBadge[]): boolean => {
  if (choseArr?.length === 0) {
    const index = choosingArr.findIndex((item) => item?.id);
    return index === -1;
  }
  let result = true;
  for (let index = 0; index < choosingArr.length; index++) {
    if (choosingArr?.[index]?.id !== choseArr?.[index]?.id) {
      result = false;
      break;
    }
  }
  return result;
};

const isAscendingArray = (arr: number[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    screenContainer: {
      zIndex: 100,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
    },
  });
};

export default SearchBadgeModal;
