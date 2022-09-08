import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { cloneDeep } from 'lodash';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Button from '~/beinComponents/Button';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupsActions from '~/storeRedux/groups/actions';
import spacing from '~/theme/spacing';

export interface SystemSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const SystemScheme: FC<SystemSchemeProps> = () => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme || {};

  const { rootNavigation } = useRootNavigation();

  const { data: communityScheme, loading: loadingCommunityScheme }
  = useKeySelector(groupsKeySelector.permission.communityScheme) || {};

  const systemScheme = useKeySelector(groupsKeySelector.permission.systemScheme) || {};

  useEffect(
    () => {
      if (!systemScheme?.data && !systemScheme?.loading) {
        dispatch(groupsActions.getSystemScheme());
      }
    }, [],
  );

  const onPressView = () => {
    if (systemScheme?.data) {
      rootNavigation.navigate(
        groupStack.schemeDetail, {
          scheme: cloneDeep(systemScheme.data),
        },
      );
    }
  };

  const onPressApply = () => {
    dispatch(modalActions.showAlert({
      title: t('communities:permission:text_title_apply_system_scheme'),
      content: t('communities:permission:text_desc_apply_system_scheme'),
      confirmLabel: t('common:btn_close'),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 style={styles.flex1} useI18n>
            communities:permission:title_system_scheme
          </Text.H5>
          {!loadingCommunityScheme && !communityScheme && (
            <TextBadge
              useI18n
              value="common:text_activated"
              style={styles.activatedText}
            />
          )}
        </View>
        <Button.Primary
          onPress={onPressView}
          useI18n
          colorHover={colors.gray5}
          textColor={colors.neutral80}
          style={styles.buttonView}
        >
          communities:permission:btn_view_permission
        </Button.Primary>
        {!loadingCommunityScheme && communityScheme && (
          <Button.Primary
            onPress={onPressApply}
            useI18n
            colorHover={colors.gray20}
            textColor={colors.neutral80}
            style={styles.buttonView}
          >
            communities:permission:btn_apply
          </Button.Primary>
        )}
      </View>
      <View style={styles.descScheme}>
        <Text.BodyS useI18n>
          communities:permission:text_desc_system_scheme
        </Text.BodyS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    titleContainer: {
      flexDirection: 'row',
      marginBottom: spacing.margin.small,
    },
    buttonView: {
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.tiny,
      marginLeft: spacing.margin.small,
      backgroundColor: colors.gray5,
    },
    activatedText: {
      marginLeft: spacing.margin.base,
    },
    descScheme: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default SystemScheme;
