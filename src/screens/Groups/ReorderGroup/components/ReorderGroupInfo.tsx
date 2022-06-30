import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IGroup} from '~/interfaces/IGroup';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import Avatar from '~/beinComponents/Avatar';

export interface ReorderGroupHeaderProps {
  style?: StyleProp<ViewStyle>;
  group: IGroup;
}

const ReorderGroupInfo: FC<ReorderGroupHeaderProps> = ({
  group,
}: ReorderGroupHeaderProps) => {
  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const {privacy, icon, name} = group || {};
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon}: any = privacyData || {};

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Icon icon={'InfoCircle'} />
        <Text.BodyS useI18n>
          communities:group_structure:text_info_reorder
        </Text.BodyS>
      </View>
      <View style={styles.groupInfo}>
        <View style={styles.grayDot} />
        <View>
          <Avatar.Small source={icon} />
          <View style={styles.iconPrivacy}>
            <Icon size={spacing.margin.base} icon={privacyIcon} />
          </View>
        </View>
        <Text.H6 numberOfLines={1} style={styles.textName}>
          {name}
        </Text.H6>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
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
      width: spacing.margin.base,
      height: spacing.margin.base,
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.background,
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
      backgroundColor: colors.bgFocus,
    },
  });
};

export default ReorderGroupInfo;
