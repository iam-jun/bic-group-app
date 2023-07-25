import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Text from '~/baseComponents/Text';

import { dimension, spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import { Avatar, Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import { borderRadius } from '~/theme/spacing';
import useGeneralInformationStore, { TypePrivacyImpact } from '../store';

interface ChangeSettingsProps {
  onChange: () => void;
}

const ChangePrivacy = (props: ChangeSettingsProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const { onChange } = props;
  const [isShowMore, setIsShowMore] = useState(false);
  const {
    affectedInnerGroupsMembershipApproval: list,
    defaultGroupSet,
    badge,
    typePrivacyImpact,
    actions: { clearPreviewPrivacy },
  } = useGeneralInformationStore((state) => state);
  const hideModal = useModalStore((state) => state.actions.hideModal);

  useEffect(
    () => () => {
      clearPreviewPrivacy();
    },
    [],
  );

  const onPressShowMore = () => {
    setIsShowMore(!isShowMore);
  };

  const onPressButtonChange = () => {
    hideModal();
    onChange();
  };

  const renderTitle = () => {
    switch (typePrivacyImpact) {
      case TypePrivacyImpact.DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL:
        return textTitle(t('settings:privacy_impact:default_group_set_and_membership_approval:title'));
      case TypePrivacyImpact.MEMBERSHIP_APPROVAL:
        return textTitle(t('settings:privacy_impact:membership_approval:title'));
      case TypePrivacyImpact.DEFAULT_GROUP_SET:
        return textTitle(t('settings:privacy_impact:default_group_set:title'));
      case TypePrivacyImpact.DEFAULT_GROUP_SET_AND_BADGE:
        return textTitle(t('settings:privacy_impact:default_group_set_and_badge:title'));
      case TypePrivacyImpact.BADGE:
        return textTitle(t('settings:privacy_impact:badge:title'));
      default:
        return 'undefined';
    }
  };

  const textTitle = (title: string) => (
    <Text.H3 style={styles.textCenter} color={colors.neutral80}>
      {title}
    </Text.H3>
  );

  const renderBadge = () => {
    if (typePrivacyImpact !== TypePrivacyImpact.BADGE) return null;
    return _renderBadge(styles.badge);
  };

  const _renderBadge = (style: StyleProp<ViewStyle>) => (
    <View style={style} testID="change_privacy.badge">
      <Avatar.Medium source={badge?.iconUrl} />
      <Text.SubtitleM style={styles.badgeName} color={colors.neutral60}>
        {badge?.name}
      </Text.SubtitleM>
    </View>
  );

  const renderContent = () => {
    const prefix = list?.length > 0 && list?.length < 10 ? '0' : '';
    const count = list?.length;
    switch (typePrivacyImpact) {
      case TypePrivacyImpact.DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL:
        return textContent(
          t('settings:privacy_impact:default_group_set_and_membership_approval:content', { count, prefix }),
        );
      case TypePrivacyImpact.MEMBERSHIP_APPROVAL:
        return textContent(t('settings:privacy_impact:membership_approval:content', { count, prefix }));
      case TypePrivacyImpact.DEFAULT_GROUP_SET:
        return textContent(t('settings:privacy_impact:default_group_set:content'));
      case TypePrivacyImpact.DEFAULT_GROUP_SET_AND_BADGE:
        return textContent(t('settings:privacy_impact:default_group_set_and_badge:content'));
      case TypePrivacyImpact.BADGE:
        return textContent(t('settings:privacy_impact:badge:content'));
      default:
        return 'undefined';
    }
  };

  const textContent = (content: string) => (
    <Text.BodyM style={[styles.textCenter, styles.content]} color={colors.neutral60}>
      {content}
      {typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET && (
        <Text.SubtitleM>{defaultGroupSet?.name}</Text.SubtitleM>
      )}
    </Text.BodyM>
  );

  const renderList = () => {
    const stylelistContainer = isShowMore ? styles.listContainer : {};
    return (
      <View style={stylelistContainer}>
        {isShowMore && renderListContent()}
        {renderButtonShowMore()}
      </View>
    );
  };

  const renderListContent = () => {
    if (
      typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL
      || typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET_AND_BADGE
    ) {
      return (
        <ScrollView style={styles.list}>
          {typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET_AND_MEMBERSHIP_APPROVAL && (
            <>
              <View style={styles.textGroup}>
                <Text.BodyM color={colors.neutral60}>
                  {t('settings:privacy_impact:default_group_set_and_membership_approval:title_default_group_set')}
                </Text.BodyM>
                <Text.SubtitleM color={colors.neutral60}>{defaultGroupSet?.name}</Text.SubtitleM>
              </View>
              <View style={[styles.textGroup, styles.SecondTextGroup]}>
                <Text.BodyM color={colors.neutral60}>
                  {t('settings:privacy_impact:default_group_set_and_membership_approval:title_membership_approval')}
                </Text.BodyM>
                {list?.map((item, index) => (
                  <Text.SubtitleM key={`${index}_${item.name}`} color={colors.neutral60}>
                    •
                    {' '}
                    {item.name}
                  </Text.SubtitleM>
                ))}
              </View>
            </>
          )}
          {typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET_AND_BADGE && (
            <>
              <View style={styles.textGroup}>
                <Text.BodyM color={colors.neutral60}>
                  {t('settings:privacy_impact:default_group_set_and_badge:title_default_group_set')}
                </Text.BodyM>
                <Text.SubtitleM color={colors.neutral60}>{defaultGroupSet?.name}</Text.SubtitleM>
              </View>
              <View style={[styles.textGroup, styles.SecondTextGroup]}>
                <Text.BodyM color={colors.neutral60}>
                  {t('settings:privacy_impact:default_group_set_and_badge:title_badge')}
                </Text.BodyM>
                {_renderBadge(styles.badgeInList)}
              </View>
            </>
          )}
        </ScrollView>
      );
    }
    // render list membership approval
    return (
      <ScrollView style={styles.list} testID="change_privacy.membership_approval">
        {list?.map((item, index) => (
          <Text.SubtitleM key={`${index}_${item.name}`} color={colors.neutral60}>
            •
            {' '}
            {item.name}
          </Text.SubtitleM>
        ))}
      </ScrollView>
    );
  };

  const renderButtonShowMore = () => {
    // eslint-disable-next-line max-len
    if (typePrivacyImpact === TypePrivacyImpact.BADGE || typePrivacyImpact === TypePrivacyImpact.DEFAULT_GROUP_SET) return null;

    return (
      <TouchableOpacity style={styles.buttonShowMore} onPress={onPressShowMore} testID="change_privacy.btn_show_more">
        <Text.LinkM color={colors.blue50}>
          {isShowMore ? t('common:btn_show_less') : t('common:btn_more_details')}
        </Text.LinkM>
        <Icon style={styles.icon} size={12} icon={isShowMore ? 'ChevronUp' : 'ChevronDown'} tintColor={colors.blue50} />
      </TouchableOpacity>
    );
  };

  const renderButtonChange = () => (
    <Button.Primary style={styles.buttonChange} onPress={onPressButtonChange}>
      {t('common:btn_confirm')}
    </Button.Primary>
  );

  return (
    <View style={styles.container}>
      {renderTitle()}
      {renderBadge()}
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
    badge: {
      flexDirection: 'row',
      padding: spacing.padding.small,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.neutral1,
      borderRadius: borderRadius.large,
      marginTop: spacing.margin.large,
    },
    badgeInList: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.margin.tiny,
    },
    badgeName: {
      flexShrink: 1,
      marginLeft: spacing.margin.small,
    },
    textGroup: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.large,
      padding: spacing.padding.small,
    },
    SecondTextGroup: {
      marginTop: spacing.margin.small,
    },
  });
};

export default ChangePrivacy;
