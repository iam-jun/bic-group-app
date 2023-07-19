import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Text from '~/baseComponents/Text';

import useMembershipPolicySettingsStore from '../store';
import { dimension, spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import { borderRadius } from '~/theme/spacing';

interface ChangeSettingsProps {
  isChangeMembershipApproval: boolean;
  name: string;
  updateJoinSetting: () => void;
}

const ChangeSettings = (props: ChangeSettingsProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const { isChangeMembershipApproval = false, name = 'undefined', updateJoinSetting } = props;
  const [isShowMore, setIsShowMore] = useState(false);
  const {
    affectedInnerGroups: list,
    actions: { clearPreviewSettings },
  } = useMembershipPolicySettingsStore((state) => state);
  const modalActions = useModalStore((state) => state.actions);

  useEffect(
    () => () => {
      clearPreviewSettings();
    },
    [],
  );

  const onPressShowMore = () => {
    setIsShowMore(!isShowMore);
  };

  const onPressButtonChange = () => {
    modalActions.hideModal();
    updateJoinSetting();
  };

  const renderTitle = () => (
    <Text.H3 style={styles.textCenter} color={colors.neutral80}>
      {isChangeMembershipApproval
        ? t('settings:membership_policy_settings:change_settings:title_membership_approval')
        : t('settings:membership_policy_settings:change_settings:title_policy_setting')}
    </Text.H3>
  );

  const renderContent = () => (
    <View>
      <Text.BodyM style={[styles.textCenter, styles.content]} color={colors.neutral60}>
        {list?.length > 0 && list?.length < 10 ? '0' : ''}
        {t(
          list?.length === 1
            ? 'settings:membership_policy_settings:change_settings:content_first_with_group'
            : 'settings:membership_policy_settings:change_settings:content_first_with_groups',
          { count: list?.length },
        )}
        <Text.SubtitleM>{name}</Text.SubtitleM>
        {isChangeMembershipApproval
          ? t('settings:membership_policy_settings:change_settings:content_membership_approval')
          : t('settings:membership_policy_settings:change_settings:content_policy_setting')}
      </Text.BodyM>
    </View>
  );

  const renderList = () => {
    const stylelistContainer = isShowMore ? styles.listContainer : {};
    return (
      <View style={stylelistContainer}>
        {isShowMore && (
          <ScrollView style={styles.list}>
            {list?.map((item, index) => (
              <Text.SubtitleM key={`${index}_${item.name}`} style={styles.textCenter} color={colors.neutral60}>
                •
                {' '}
                {item.name}
              </Text.SubtitleM>
            ))}
          </ScrollView>
        )}
        {renderButtonShowMore()}
      </View>
    );
  };

  const renderButtonShowMore = () => (
    <TouchableOpacity style={styles.buttonShowMore} onPress={onPressShowMore}>
      <Text.LinkM color={colors.blue50}>
        {isShowMore
          ? t('settings:membership_policy_settings:change_settings:button_show_less')
          : t('settings:membership_policy_settings:change_settings:button_more_details')}
      </Text.LinkM>
      <Icon style={styles.icon} size={12} icon={isShowMore ? 'ChevronUp' : 'ChevronDown'} tintColor={colors.blue50} />
    </TouchableOpacity>
  );

  const renderButtonChange = () => (
    <Button.Primary style={styles.buttonChange} onPress={onPressButtonChange}>
      {isChangeMembershipApproval
        ? t('settings:membership_policy_settings:change_settings:button_turn_on')
        : t('settings:membership_policy_settings:change_settings:button_change')}
    </Button.Primary>
  );

  return (
    <View style={styles.container} testID="change_settings">
      {renderTitle()}
      {renderContent()}
      {renderList()}
      {renderButtonChange()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.padding.large,
    },
    textCenter: {
      textAlign: 'center',
    },
    content: {
      marginTop: spacing.margin.large,
    },
    buttonShowMore: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.margin.small,
    },
    icon: {
      marginLeft: spacing.margin.tiny,
    },
    list: {
      maxHeight: dimension.deviceHeight < 770 ? dimension.deviceHeight / 3 : dimension.deviceHeight / 2,
    },
    buttonChange: {
      marginTop: spacing.margin.large,
    },
    listContainer: {
      marginTop: spacing.margin.large,
      padding: spacing.padding.base,
      backgroundColor: colors.neutral1,
      borderRadius: borderRadius.large,
    },
  });
};

export default ChangeSettings;
