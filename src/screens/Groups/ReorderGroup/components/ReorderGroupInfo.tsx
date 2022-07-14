import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import {IGroup} from '~/interfaces/IGroup';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import Avatar from '~/beinComponents/Avatar';
import spacing from '~/theme/spacing';

export interface ReorderGroupHeaderProps {
  style?: StyleProp<ViewStyle>;
  group: IGroup;
}

const ReorderGroupInfo: FC<ReorderGroupHeaderProps> = ({
  group,
}: ReorderGroupHeaderProps) => {
  const theme = useTheme() as ExtendedTheme;
  const styles = createStyle(theme);

  const {privacy, icon, name} = group || {};
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon}: any = privacyData || {};

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Icon icon={'CircleInfo'} />
        <Text.BodyS useI18n>
          communities:group_structure:text_info_reorder
        </Text.BodyS>
      </View>
      <View style={styles.groupInfo}>
        <View style={styles.grayDot} />
        <View>
          <Avatar.Medium source={icon} />
          <View style={styles.iconPrivacy}>
            <Icon size={spacing.margin.large} icon={privacyIcon} />
          </View>
        </View>
        <Text.H6 numberOfLines={1} style={styles.textName}>
          {name}
        </Text.H6>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.tiny,
      marginLeft: spacing.margin.small,
    },
    iconPrivacy: {
      width: spacing.margin.large,
      height: spacing.margin.large,
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.white,
      borderRadius: 2,
    },
    groupInfo: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.large,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {flex: 1, marginLeft: spacing.margin.small},
    grayDot: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.small,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.gray20,
    },
  });
};

export default ReorderGroupInfo;
