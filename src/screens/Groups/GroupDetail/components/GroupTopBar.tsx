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
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import GroupHeaderMenu from '~/screens/Groups/GroupDetail/components/GroupHeaderMenu';
import {openLink} from '~/utils/common';
import {chatSchemes} from '~/constants/chat';

const GroupTopBar = () => {
  const dispatch = useDispatch();
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
    if (!route.params?.initial) rootNavigation.replace(groupStack.groups);
    else rootNavigation.goBack();
  };

  const onPressMenu = (event?: any) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: <GroupHeaderMenu groupId={groupId} />,
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
          menuMinWidth: 280,
          position: {x: event?.pageX, y: event?.pageY},
          modalStyle: {borderTopLeftRadius: 20, borderTopRightRadius: 20},
        },
      }),
    );
  };

  const onPressChat = () => {
    openLink(chatSchemes.CHANNELS);
  };

  const renderAdminButton = () => {
    // only admin can see this button
    return (
      <ButtonWrapper onPress={onPressMenu}>
        <Icon
          testID="group_top_bar.admin_button"
          icon={'iconShieldStar'}
          fill={theme.colors.iconTint}
          size={24}
        />
      </ButtonWrapper>
    );
  };

  const renderSearchIcon = () => {
    // only members can see this icon
    return (
      join_status === groupJoinStatus.member && (
        <ButtonWrapper onPress={() => alert('Press search')}>
          <Icon
            testID="group_top_bar.search"
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
      <ButtonWrapper onPress={onPressMenu}>
        <Icon
          testID="group_top_bar.option_menu"
          icon={'EllipsisH'}
          tintColor={theme.colors.iconTint}
        />
      </ButtonWrapper>
    );
  };

  const renderChatIcon = () => {
    return (
      <ButtonWrapper onPress={onPressChat}>
        <Icon
          testID="group_top_bar.option_menu"
          icon={'CommentsAlt'}
          size={24}
          tintColor={theme.colors.iconTint}
          style={styles.iconShieldStar}
        />
      </ButtonWrapper>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftComponent}>
        {!isLaptop && (
          <Icon
            icon="iconBack"
            size={28}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={onPressBack}
          />
        )}
      </View>
      <View style={styles.rightComponent}>
        {renderSearchIcon()}
        {renderChatIcon()}
        {can_setting ? renderAdminButton() : renderGroupOption()}
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
      alignItems: 'center',
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
      marginRight: spacing.margin.extraLarge,
    },
    iconSearch: {
      marginRight: spacing.margin.extraLarge,
    },
  });
};
