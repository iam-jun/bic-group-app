import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';

const MyDraft = () => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const [loading, setLoading] = useState(true);
  const [badge, setBadge] = useState('');
  const modalActions = useModalStore((state) => state.actions);

  useEffect(() => {
    const getTotalDraft = async () => {
      try {
        const { data: totalNumber = 0 } = await streamApi.getTotalDraft() || {};
        const totalText = handleTotalText(totalNumber);
        if (totalText) {
          setBadge(totalText);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    getTotalDraft();
  }, []);

  const handleTotalText = (totalNumber: any) => {
    if (totalNumber >= 100) {
      return '99+';
    }
    if (totalNumber > 0) {
      return totalNumber;
    }
    return '';
  };

  const goToDraftPost = () => {
    modalActions.hideModal();
    rootNavigation.navigate(
      menuStack.yourContent,
      { initTab: 0 },
    );
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        testID="button.loading"
        color={colors.neutral40}
        style={styles.loading}
        size={12}
      />
    );
  };

  const renderBadge = () => {
    if (!badge || loading) return null;
    return (
      <View style={styles.badge}>
        <Text.BadgeS color={colors.white}>
          {badge}
        </Text.BadgeS>
      </View>
    );
  };

  return (
    <ButtonWrapper onPress={goToDraftPost} style={styles.container} testID="my_draft">
      <Text.BodyM color={colors.neutral60} style={styles.flex1} useI18n>
        home:create_content_options:my_draft
      </Text.BodyM>
      {renderLoading()}
      {renderBadge()}
    </ButtonWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    loading: {
      marginLeft: spacing.margin.small,
    },
    container: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
      justifyContent: 'space-between',
    },
    badge: {
      backgroundColor: colors.red40,
      borderRadius: spacing.borderRadius.pill,
      paddingHorizontal: spacing.padding.tiny,
      paddingVertical: spacing.padding.xTiny,
    },
  });
};

export default MyDraft;
