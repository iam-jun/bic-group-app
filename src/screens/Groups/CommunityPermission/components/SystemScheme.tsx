import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {cloneDeep} from 'lodash';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Button from '~/beinComponents/Button';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import groupsActions from '~/screens/Groups/redux/actions';
import {getOrderedPermissionRoles} from '../../redux/selectors';

export interface SystemSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const SystemScheme: FC<SystemSchemeProps> = ({style}: SystemSchemeProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {colors} = theme || {};

  const {rootNavigation} = useRootNavigation();

  const {data: communityScheme, loading: loadingCommunityScheme} =
    useKeySelector(groupsKeySelector.permission.communityScheme) || {};
  const systemScheme =
    useKeySelector(groupsKeySelector.permission.systemScheme) || {};
  const roles = getOrderedPermissionRoles('system');

  useEffect(() => {
    if (!systemScheme?.data && !systemScheme?.loading) {
      dispatch(groupsActions.getSystemScheme());
    }
  }, []);

  const onPressView = () => {
    if (systemScheme?.data) {
      rootNavigation.navigate(groupStack.communityPermissionDetail, {
        scheme: {...cloneDeep(systemScheme.data), roles},
      });
    }
  };

  const onPressApply = () => {
    dispatch(
      modalActions.showAlert({
        title: t('communities:permission:text_title_apply_system_scheme'),
        content: t('communities:permission:text_desc_apply_system_scheme'),
        confirmLabel: t('common:btn_close'),
      }),
    );
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
              value={'common:text_activated'}
              style={styles.activatedText}
            />
          )}
        </View>
        <Button.Primary
          onPress={onPressView}
          useI18n
          colorHover={colors.borderCard}
          textColor={colors.textPrimary}
          style={styles.buttonView}>
          communities:permission:btn_view_permission
        </Button.Primary>
        {!loadingCommunityScheme && communityScheme && (
          <Button.Primary
            onPress={onPressApply}
            useI18n
            colorHover={colors.borderCard}
            textColor={colors.textPrimary}
            style={styles.buttonView}>
            communities:permission:btn_apply
          </Button.Primary>
        )}
      </View>
      <View style={styles.descScheme}>
        <Text.Subtitle useI18n>
          communities:permission:text_desc_system_scheme
        </Text.Subtitle>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.background,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    buttonView: {
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.tiny,
      marginLeft: spacing.margin.small,
      backgroundColor: colors.bgHover,
    },
    activatedText: {
      marginHorizontal: spacing.margin.small,
    },
    descScheme: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default SystemScheme;
