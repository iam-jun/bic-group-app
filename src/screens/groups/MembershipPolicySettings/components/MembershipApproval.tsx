import { t } from 'i18next';
import React, { FC, useEffect, useState } from 'react';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Tooltip from 'react-native-walkthrough-tooltip';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { Toggle } from '~/baseComponents';
import { IGroup } from '~/interfaces/IGroup';
import { ICommunity } from '~/interfaces/ICommunity';
import { CommunityPrivacyType, GroupPrivacyType } from '~/constants/privacyTypes';
import showAlert from '~/store/helper/showAlert';
import { IGroupSettings } from '~/interfaces/common';
import { checkTypeByRootGroup } from '../helper';

export const topAdjustment = Platform.OS === 'android' ? -StatusBar.currentHeight + 3 : 0;

export interface Props {
  data: IGroup | ICommunity;
  updateJoinSetting: (payload: IGroupSettings) => void;
}

const MembershipApproval: FC<Props> = (props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const { data, updateJoinSetting } = props || {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const typeByRootGroup = checkTypeByRootGroup(data);

  const privacy = data?.privacy;
  const isJoinApproval = data?.affectedSettings?.isJoinApproval;
  const isInvitedOnly = data?.affectedSettings?.isInvitedOnly;
  const isPrivatePrivacy = privacy === CommunityPrivacyType.PRIVATE || privacy === GroupPrivacyType.PRIVATE;
  const isSecretPrivacy = privacy === GroupPrivacyType.SECRET;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isInDefaultGroupSet = data?.isInDefaultGroupSet;

  const [isCheckedToggle, setIsCheckedToggle] = useState<boolean>(isJoinApproval || false);
  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);

  useEffect(() => {
    setIsCheckedToggle(isJoinApproval);
  }, [isJoinApproval]);

  const onPressToggle = (isChecked: boolean) => {
    if (isChecked) return onShowAlertTurnOn();
    return onShowAlertTurnOff();
  };

  const onShowAlertTurnOn = () => {
    setIsCheckedToggle(true);
    updateJoinSetting({ isJoinApproval: true });
  };

  const onShowAlertTurnOff = () => {
    const alertPayload = {
      title: t('settings:membership_policy_settings:alert_turn_off_membership_approval:title'),
      content: t('settings:membership_policy_settings:alert_turn_off_membership_approval:description'),
      cancelBtn: true,
      cancelLabel: t('settings:membership_policy_settings:alert_turn_off_membership_approval:turn_off'),
      onCancel: _onPressTurnOff,
      confirmLabel: t('common:btn_cancel'),
    };
    showAlert(alertPayload);
  };

  const _onPressTurnOff = () => {
    setIsCheckedToggle(false);
    updateJoinSetting({ isJoinApproval: false });
  };

  const _setIsVisibleTooltip = () => {
    setIsVisibleTooltip(!isVisibleTooltip);
  };

  const renderContentTooltip = () => (
    <Text.BodyM useI18n color={colors.white}>
      {isInDefaultGroupSet
        ? 'settings:membership_policy_settings:tooltip:default_group_set_toggle'
        : t('settings:membership_policy_settings:tooltip:private', { type: typeByRootGroup })}
    </Text.BodyM>
  );

  const isRenderNull = isSecretPrivacy || (isPrivatePrivacy && isInvitedOnly) || isInvitedOnly;

  if (isRenderNull) {
    return null;
  }

  const isDisabled = isPrivatePrivacy || isInDefaultGroupSet;
  const position = isDisabled ? 'absolute' : 'relative';

  return (
    <View style={styles.container} testID="membership_approval">
      <View style={styles.textMembership}>
        <Text.SubtitleM color={colors.neutral80}>
          {t('settings:membership_policy_settings:membership_approval')}
        </Text.SubtitleM>
        <Text.BodyS color={colors.neutral40}>
          {t('settings:membership_policy_settings:membership_approval_description', { type: typeByRootGroup })}
        </Text.BodyS>
      </View>
      <View>
        <Toggle
          testID="membership_approval.toggle"
          style={[styles.toggle, { position }]}
          isChecked={isCheckedToggle}
          onValueChanged={onPressToggle}
          disableBuiltInState
          disabled={isDisabled}
        />
        {!!isDisabled && (
          <Tooltip
            arrowSize={styles.arrowSize}
            isVisible={isVisibleTooltip}
            disableShadow
            childContentSpacing={3}
            placement="left"
            contentStyle={styles.tooltipStyle}
            content={renderContentTooltip()}
            backgroundColor="transparent"
            topAdjustment={topAdjustment}
            onClose={_setIsVisibleTooltip}
          >
            <TouchableWithoutFeedback style={styles.btnFake} onPress={_setIsVisibleTooltip} />
          </Tooltip>
        )}
      </View>
    </View>
  );
};

export default MembershipApproval;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textMembership: {
      flex: 1,
      flexWrap: 'nowrap',
      paddingRight: spacing.margin.large,
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      width: 200,
    },
    btnFake: {
      height: 20,
      width: 40,
    },
    arrowSize: {
      width: 12,
      height: 6,
    },
    toggle: {
      right: 0,
    },
  });
};
