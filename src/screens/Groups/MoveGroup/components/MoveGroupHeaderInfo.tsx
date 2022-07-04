import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IGroup} from '~/interfaces/IGroup';
import Avatar from '~/beinComponents/Avatar';
import Divider from '~/beinComponents/Divider';
import {useBaseHook} from '~/hooks';
import MoveLine from '../../../../../assets/images/img_move_line.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import {getAllChildrenName} from '~/screens/Groups/helper';

export interface MoveGroupHeaderInfoProps {
  style?: StyleProp<ViewStyle>;
  group: IGroup;
}

const MoveGroupHeaderInfo: FC<MoveGroupHeaderInfoProps> = ({
  style,
  group,
}: MoveGroupHeaderInfoProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {icon, name, children} = group || {};

  const childrenName =
    getAllChildrenName(group).join?.(', ') ||
    t('communities:group_structure:text_no_group');

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: spacing.margin.large,
          flexDirection: 'row',
        }}>
        <SvgIcon
          // @ts-ignore
          source={MoveLine}
          width={24}
          height={172}
          tintColor="none"
          style={{
            marginTop: 2,
            marginRight: spacing.margin.tiny,
          }}
        />
        <View style={styles.blueDot} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.groupNameContainer}>
          <Avatar.Small style={styles.iconGroup} source={icon} />
          <Text.H6 style={styles.groupName} numberOfLines={1}>
            {name}
          </Text.H6>
        </View>
        <Divider color={colors.borderFocus} />
        <View style={styles.childrenInfo}>
          <Text.BodyS>
            <Text.BodySM>{childrenName}</Text.BodySM>{' '}
            {t('communities:group_structure:text_will_be_move')}{' '}
            <Text.BodySM>{name}</Text.BodySM>
          </Text.BodyS>
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.extraLarge,
    },
    infoContainer: {
      flex: 1,
      marginTop: spacing.margin.extraLarge,
      borderWidth: 1,
      borderColor: colors.borderFocus,
      alignSelf: 'flex-start',
      marginBottom: spacing.margin.extraLarge,
    },
    childrenInfo: {
      padding: spacing.padding.small,
    },
    groupNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      paddingVertical: 2,
    },
    groupName: {
      flex: 1,
    },
    iconGroup: {
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.tiny,
    },
    blueDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textInfo,
      marginTop: spacing.margin.extraLarge,
      marginRight: spacing.margin.small,
    },
  });
};

export default MoveGroupHeaderInfo;
