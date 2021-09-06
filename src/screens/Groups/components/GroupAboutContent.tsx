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
import groupsKeySelector from '../redux/keySelector';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

const GroupAboutContent = () => {
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const groupId = groupData.id;
  const {description, user_count, privacy} = groupData;

  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon, title, subtitle}: any = privacyData || {};

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  return (
    <View style={styles.container}>
      {!!description && (
        <>
          <Text.H5 useI18n style={styles.labelDescription}>
            common:text_description
          </Text.H5>
          <CollapsibleText
            limitLength={500}
            shortLength={500}
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
        onPress={onPressMembers}
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
    },
    labelDescription: {
      paddingVertical: spacing.padding.small,
    },
    descriptionContainer: {
      paddingBottom: spacing.padding.small,
    },
    memberItem: {
      paddingHorizontal: 0,
      paddingVertical: spacing.padding.base,
    },
    privacyItem: {
      paddingHorizontal: 0,
    },
  });
};

export default GroupAboutContent;
