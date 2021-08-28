import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import groupsKeySelector from '../../redux/keySelector';

const GroupAbout = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group);
  const {description, user_count, privacy} = groupData;

  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon, title, subtitle}: any = privacyData || {};

  const onPressMember = () => {
    alert('onPress member');
  };

  return (
    <View style={styles.container}>
      {!!description && (
        <>
          <Text.H5 useI18n style={styles.labelDescription}>
            common:text_description
          </Text.H5>
          <CollapsibleText
            textProps={{variant: 'h4', style: styles.descriptionContainer}}
            content={description}
          />
        </>
      )}
      <PrimaryItem
        style={styles.memberItem}
        leftIcon={'UsersAlt'}
        leftIconProps={{
          icon: 'UsersAlt',
          size: 24,
        }}
        onPress={onPressMember}
        title={`${user_count} ${i18next.t('common:text_member')}`}
        RightComponent={<Icon icon={'AngleRightB'} />}
      />
      <PrimaryItem
        style={styles.privacyItem}
        leftIcon={icon}
        leftIconProps={{
          icon: icon,
          size: 24,
        }}
        title={i18next.t(title)}
        subTitle={i18next.t(subtitle)}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.large,
      marginTop: spacing.margin.base,
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
    memberItem: {height: 44, paddingHorizontal: 0},
    privacyItem: {height: 56, paddingHorizontal: 0},
  });
};

export default GroupAbout;
