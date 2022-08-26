import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Text from '~/beinComponents/Text';
import { Toggle } from '~/baseComponents';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';

interface JoinRequestSettingProps {
  type: 'community' | 'group';
  total: number;
  isJoinApproval?: boolean;
  onUpdateJoinSetting: (isJoinApproval: boolean) => void;
  onPressApproveAll: () => void;
}

const JoinRequestSetting = ({
  type,
  total,
  isJoinApproval,
  onUpdateJoinSetting,
  onPressApproveAll,
}: JoinRequestSettingProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const [isChecked, setIsChecked] = useState(isJoinApproval || false);
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  useEffect(() => {
    setIsChecked(isJoinApproval);
  }, [isJoinApproval]);

  const _onPressTurnOn = () => {
    setIsChecked(true);
    onUpdateJoinSetting?.(true);
  };

  const _onPressTurnOff = () => {
    setIsChecked(false);
    onUpdateJoinSetting?.(false);
  };

  const _onPressTurnOffWithRequests = () => {
    onPressApproveAll?.();
    _onPressTurnOff();
  };

  const alertAction = ({
    title,
    content,
    confirmLabel,
    doAction,
  }:{
    title?: string;
    content?: string;
    confirmLabel?: string;
    doAction?: () => void;
    onPressCancel?: () => void;
  }) => {
    const alertPayload = {
      title,
      content,
      cancelBtn: true,
      cancelLabel: confirmLabel,
      onCancel: doAction,
      confirmLabel: t('common:btn_cancel'),
    };

    dispatch(modalActions.showAlert(alertPayload));
  };

  const onShowAlertTurnOn = () => {
    alertAction({
      title: t('communities:join_request_setting:pop_up_on:title'),
      content: t(`communities:join_request_setting:pop_up_on:content_${type}`),
      confirmLabel: t('communities:join_request_setting:pop_up_on:confirm'),
      doAction: _onPressTurnOn,
    });
  };

  const onShowAlertTurnOff = () => {
    alertAction({
      title: t('communities:join_request_setting:pop_up_off:title'),
      content: t(`communities:join_request_setting:pop_up_off:content_${type}`),
      confirmLabel: t('communities:join_request_setting:pop_up_off:confirm'),
      doAction: _onPressTurnOff,
    });
  };

  const onShowAlertTurnOffWithRequests = () => {
    alertAction({
      title: t('communities:join_request_setting:pop_up_off:title'),
      content: t('communities:join_request_setting:pop_up_off:content_with_requests'),
      confirmLabel: t('communities:join_request_setting:pop_up_off:approve_all'),
      doAction: _onPressTurnOffWithRequests,
    });
  };

  const onPressToggle = (isChecked: boolean) => {
    if (isChecked) return onShowAlertTurnOn();

    if (total > 0) return onShowAlertTurnOffWithRequests();

    return onShowAlertTurnOff();
  };

  return (
    <View style={styles.container}>
      <View style={styles.line1}>
        <Text.BodyMMedium useI18n>communities:join_request_setting:title</Text.BodyMMedium>
        <Toggle isChecked={isChecked} onPress={onPressToggle} />
      </View>

      <View style={styles.line2}>
        <Icon icon="CircleInfo" size={15} tintColor={theme.colors.neutral20} />
        <Text.BodyS
          style={styles.descriptionText}
          color={theme.colors.neutral40}
          useI18n
        >
          {isChecked
            ? `communities:join_request_setting:description_on_${type}`
            : `communities:join_request_setting:description_off_${type}` }
        </Text.BodyS>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral1,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.large,
    },
    line1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    line2: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.tiny,
    },
    descriptionText: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default JoinRequestSetting;
