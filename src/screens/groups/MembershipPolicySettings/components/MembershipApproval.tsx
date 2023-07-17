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
import { GroupPrivacyType } from '~/constants/privacyTypes';
import showAlert from '~/store/helper/showAlert';
import { IGroupSettings } from '~/interfaces/common';
import { checkTypeByRootGroup } from '../helper';
import { IDataSettings } from '../store';

export const topAdjustment = Platform.OS === 'android' ? -StatusBar.currentHeight : 0;

export interface SettingsProps {
  data: IGroup | ICommunity;
  settings: IDataSettings['settings'];
  changeableSettings: IDataSettings['changeableSettings'];
  updateJoinSetting: (payload: IGroupSettings) => void;
}

const MembershipApproval: FC<SettingsProps> = (props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const {
    data, settings, changeableSettings, updateJoinSetting,
  } = props || {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const typeByRootGroup = checkTypeByRootGroup(data);

  const privacy = data?.privacy;
  const isJoinApproval = settings?.isJoinApproval;
  const isInvitedOnly = settings?.isInvitedOnly;
  const isSecretPrivacy = privacy === GroupPrivacyType.SECRET;
  const contentTooltip = changeableSettings?.isJoinApproval;

  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    setIsToggle(isJoinApproval);
  }, [isJoinApproval]);

  const onPressToggle = (isChecked: boolean) => {
    if (isChecked) return onPressTurnOn();
    return onShowAlertTurnOff();
  };

  const onPressTurnOn = () => {
    updateJoinSetting({ isJoinApproval: true });
  };

  const onShowAlertTurnOff = () => {
    const alertPayload = {
      title: t('settings:membership_policy_settings:alert_turn_off_membership_approval:title'),
      content: t('settings:membership_policy_settings:alert_turn_off_membership_approval:description'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      onConfirm: onPressTurnOff,
      confirmLabel: t('settings:membership_policy_settings:alert_turn_off_membership_approval:turn_off'),
    };
    showAlert(alertPayload);
  };

  const onPressTurnOff = () => {
    updateJoinSetting({ isJoinApproval: false });
  };

  const _setIsVisibleTooltip = () => {
    setIsVisibleTooltip(!isVisibleTooltip);
  };

  const renderContentTooltip = () => (
    <Text.BodyM useI18n color={colors.white}>
      {contentTooltip}
    </Text.BodyM>
  );

  const isRenderNull = isSecretPrivacy || isInvitedOnly;

  if (isRenderNull) {
    return null;
  }

  const isDisabled = !!contentTooltip;
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
          isChecked={isToggle}
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
