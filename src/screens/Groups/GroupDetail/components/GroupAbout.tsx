import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import privacyTypes from '~/constants/privacyTypes';
import {useBaseHook} from '~/hooks';

const GroupAbout = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {t} = useBaseHook();
  const groupData = useKeySelector('groups.groupDetail.group');
  const {description, user_count, privacy} = groupData || {};

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
        title={`${user_count} ${t('common:text_member')}`}
        RightComponent={<Icon icon={'AngleRightB'} />}
      />
      <PrimaryItem
        style={styles.privacyItem}
        leftIcon={icon}
        leftIconProps={{
          icon: icon,
          size: 24,
        }}
        title={t(title)}
        subTitle={t(subtitle)}
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
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
    memberItem: {height: 44},
    privacyItem: {height: 56},
  });
};

export default GroupAbout;
