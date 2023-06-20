import { t } from 'i18next';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { Radio } from '~/baseComponents';
import { Props, topAdjustment } from './MembershipApproval';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import { dimension } from '~/theme';
import { checkTypeByRootGroup } from '../helper';

interface IOption {
  id: number;
  title: string;
  description: string;
}

export enum IdType {
  ANYONE = 0,
  ONLY_INVITED_PEOPLE = 1,
}

const OptionsWhoCanJoin: FC<Props> = (props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const { data, updateJoinSetting } = props || {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const typeByRootGroup = checkTypeByRootGroup(data);

  const OPTIONS: IOption[] = [
    {
      id: IdType.ANYONE,
      title: t('settings:membership_policy_settings:anyone'),
      description: t('settings:membership_policy_settings:anyone_description', { type: typeByRootGroup }),
    },
    {
      id: IdType.ONLY_INVITED_PEOPLE,
      title: t('settings:membership_policy_settings:only_invited_people'),
      description: t('settings:membership_policy_settings:only_invited_people_description'),
    },
  ];

  const isInvitedOnly = data?.affectedSettings?.isInvitedOnly;
  const isSecretPrivacy = data?.privacy === GroupPrivacyType.SECRET;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isInDefaultGroupSet = data?.isInDefaultGroupSet;

  const [selectedOption, setSelectedOption] = useState<IOption>(
    isInvitedOnly ? OPTIONS[IdType.ONLY_INVITED_PEOPLE] : OPTIONS[IdType.ANYONE],
  );
  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false);
  const [heightView, setHeightView] = useState<number>(0);

  const onPress = (option: IOption) => {
    if (option.id === selectedOption.id) return;
    setSelectedOption(option);
    if (option.id === OPTIONS[IdType.ANYONE].id) {
      updateJoinSetting({ isInvitedOnly: false });
    } else {
      updateJoinSetting({ isInvitedOnly: true });
    }
  };

  const _setIsVisibleTooltip = () => {
    setIsVisibleTooltip(!isVisibleTooltip);
  };

  const renderContentTooltip = () => (
    <Text.BodyM useI18n color={colors.white}>
      {isInDefaultGroupSet
        ? 'settings:membership_policy_settings:tooltip:default_group_set_radio'
        : 'settings:membership_policy_settings:tooltip:secret'}
    </Text.BodyM>
  );

  const renderOptions = () => OPTIONS.map((option) => {
    const isChecked = selectedOption?.id === option.id;
    const isDisabled = (isSecretPrivacy && !isChecked) || (isInDefaultGroupSet && !isChecked);

    const backgroundColor = isChecked ? colors.neutral2 : colors.white;
    const titleColor = isDisabled ? colors.neutral30 : colors.neutral80;
    const descriptionColor = isDisabled ? colors.neutral30 : colors.neutral40;
    const position = isDisabled ? 'absolute' : 'relative';

    return (
      <View key={option.id} style={styles.optionContainer}>
        <View
          style={[styles.optionView, { backgroundColor, position }]}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setHeightView(height);
          }}
        >
          <Radio
            key={`options_who_can_join.raido_${option.id}`}
            testID={`options_who_can_join.raido_${option.id}`}
            isChecked={isChecked}
            onPress={() => onPress(option)}
            style={styles.optionRadio}
            disabled={isDisabled ? 'disabled' : undefined}
          />
          <TouchableWithoutFeedback onPress={() => onPress(option)} disabled={isDisabled}>
            <View style={styles.optionText}>
              <Text.SubtitleM color={titleColor}>{option.title}</Text.SubtitleM>
              <Text.BodyS color={descriptionColor}>{option.description}</Text.BodyS>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {!!isDisabled && (
        <Tooltip
          arrowSize={styles.arrowSize}
          isVisible={isVisibleTooltip}
          disableShadow
          childContentSpacing={3}
          placement="top"
          contentStyle={styles.tooltipStyle}
          content={renderContentTooltip()}
          backgroundColor="transparent"
          topAdjustment={topAdjustment}
          onClose={_setIsVisibleTooltip}
        >
          <TouchableWithoutFeedback
            style={[styles.btnFake, { height: heightView }]}
            onPress={_setIsVisibleTooltip}
          />
        </Tooltip>
        )}
      </View>
    );
  });

  return (
    <View style={styles.container} testID="options_who_can_join">
      <Text.BodyMMedium color={colors.neutral80}>
        {t('settings:membership_policy_settings:who_can_join_this_group', { type: typeByRootGroup })}
      </Text.BodyMMedium>
      {renderOptions()}
    </View>
  );
};

export default OptionsWhoCanJoin;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    optionContainer: {
      marginTop: spacing.margin.base,
    },
    optionView: {
      flexDirection: 'row',
      padding: spacing.padding.large,
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      borderColor: colors.neutral5,
      right: 0,
      left: 0,
      top: 0,
    },
    optionRadio: {
      alignSelf: 'center',
    },
    optionText: {
      marginLeft: spacing.margin.large,
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      width: 200,
    },
    btnFake: {
      width: dimension.deviceWidth - 2 * spacing.padding.large,
    },
    arrowSize: {
      width: 12,
      height: 6,
    },
  });
};
