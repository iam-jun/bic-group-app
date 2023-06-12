import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, {
  FadeInDown, FadeOutUp,
} from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing from '~/theme/spacing';
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

  const isDisable = checkEqual(choosingBadges, showingBadges);

  useEffect(() => {
    if (isEditing) { setIsOpen(true); }
  }, [isEditing]);

  const onClose = () => {
    setIsOpen(false);
    actions.cancleSaveBadges();
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
          buttonProps={{ disabled: isDisable, loading: loadingEditing }}
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
    body: {
      flex: 1,
    },
    buttonsContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 271,
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
    buttonView: {
      zIndex: 2,
      position: 'absolute',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      bottom: 0,
      left: 0,
      right: 0,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 12,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10.32,
      elevation: 12,
    },
    contentContainerStyle: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
      paddingBottom: 100,
    },
    loading: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });
};

export default SearchBadgeModal;
