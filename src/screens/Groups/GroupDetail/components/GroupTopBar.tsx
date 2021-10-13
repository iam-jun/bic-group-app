import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {RouteProp, useRoute} from '@react-navigation/native';

import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {deviceDimensions} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {RootStackParamList} from '~/interfaces/IRouter';

const GroupTopBar = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {id: groupId} = groupInfo || {};

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const route = useRoute<RouteProp<RootStackParamList, 'GroupDetail'>>();

  const onPressBack = () => {
    if (route.params?.initial === false)
      rootNavigation.replace(groupStack.groups);
    else rootNavigation.goBack();
  };

  const renderAdminButton = () => {
    // only admin can see this button
    return (
      can_setting && (
        <ButtonWrapper
          onPress={() =>
            rootNavigation.navigate(groupStack.groupAdmin, {groupId})
          }>
          <Icon
            icon={'iconShieldStar'}
            fill={theme.colors.iconTint}
            size={24}
            style={styles.iconShieldStar}
          />
        </ButtonWrapper>
      )
    );
  };

  const renderSearchIcon = () => {
    // only members can see this icon
    return (
      join_status === groupJoinStatus.member && (
        <ButtonWrapper onPress={() => alert('Press search')}>
          <Icon
            icon={'iconSearch'}
            size={22}
            style={styles.iconSearch}
            tintColor={theme.colors.iconTint}
          />
        </ButtonWrapper>
      )
    );
  };

  const renderGroupOption = () => {
    return (
      <ButtonWrapper onPress={() => alert('Press Group option...')}>
        <Icon icon={'EllipsisH'} tintColor={theme.colors.iconTint} />
      </ButtonWrapper>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftComponent}>
        {!isLaptop && (
          <Icon
            icon={'iconBack'}
            size={26}
            tintColor={theme.colors.iconTint}
            onPress={onPressBack}
          />
        )}
      </View>
      <View style={styles.rightComponent}>
        {renderSearchIcon()}
        {renderAdminButton()}
        {renderGroupOption()}
      </View>
    </View>
  );
};

export default GroupTopBar;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    leftComponent: {
      flexDirection: 'row',
    },
    rightComponent: {
      flexDirection: 'row',
    },
    iconShieldStar: {
      marginRight: spacing.margin.large,
    },
    iconSearch: {
      marginRight: spacing.margin.large,
    },
  });
};
