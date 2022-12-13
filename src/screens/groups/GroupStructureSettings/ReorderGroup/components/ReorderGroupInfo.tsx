import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';

export interface ReorderGroupInfoProps {
  group: IGroup;
}

const ReorderGroupInfo: FC<ReorderGroupInfoProps> = ({
  group,
}: ReorderGroupInfoProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { privacy, icon, name } = group || {};
  const privacyData = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon }: any = privacyData || {};

  const renderTitleInfo = () => (
    <View style={styles.title}>
      <Icon icon="CircleInfo" tintColor={theme.colors.neutral20} size={18} />
      <Text.BodyS color={theme.colors.neutral40} style={styles.textInfo} useI18n>
        communities:group_structure:text_info_reorder
      </Text.BodyS>
    </View>
  );

  const renderParentGroupBlock = () => (
    <View style={styles.groupInfo}>
      <Avatar.Base source={icon} privacyIcon={privacyIcon} />
      <Text.BodyMMedium
        numberOfLines={2}
        style={styles.textName}
        color={theme.colors.neutral60}
      >
        {name}
      </Text.BodyMMedium>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTitleInfo()}
      {renderParentGroupBlock()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.large,
    },
    title: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      alignItems: 'center',
      marginBottom: spacing.margin.tiny,
      backgroundColor: colors.neutral1,
    },
    textInfo: {
      marginHorizontal: spacing.margin.small,
    },
    groupInfo: {
      marginVertical: spacing.margin.large,
      paddingRight: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
  });
};

export default ReorderGroupInfo;
