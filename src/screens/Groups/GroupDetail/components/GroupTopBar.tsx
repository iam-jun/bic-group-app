import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import GroupHeaderMenu from '~/screens/Groups/GroupDetail/components/GroupHeaderMenu';
import modalActions from '~/store/modal/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {openLink} from '~/utils/common';
import {formatChannelLink} from '~/utils/link';
import groupsKeySelector from '../../redux/keySelector';

const GroupTopBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const can_setting = useKeySelector(groupsKeySelector.groupDetail.can_setting);
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const groupInfo = useKeySelector(groupsKeySelector.groupDetail.group);
  const {id: groupId, chat_id: chatId} = groupInfo || {};

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;
  const count = useKeySelector(
    `chat.unreadChannels.${chatId}.mention_count_root`,
  );

  const onPressBack = () => {
    rootNavigation.goBack();
    // if (!route.params?.initial) rootNavigation.replace(groupStack.groups);
    // else rootNavigation.goBack();
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
    const link = formatChannelLink(groupInfo.team_name, groupInfo.slug);
    openLink(link);
  };

  const onPressSearch = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderAdminButton = () => {
    // only admin can see this button
    return (
      <ButtonWrapper onPress={onPressMenu} testID="group_top_bar.admin_button">
        <Icon icon={'iconShieldStar'} fill={theme.colors.iconTint} size={24} />
      </ButtonWrapper>
    );
  };

  const renderSearchIcon = () => {
    // only members can see this icon
    return (
      join_status === groupJoinStatus.member && (
        <ButtonWrapper onPress={onPressSearch} testID="group_top_bar.search">
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
      <ButtonWrapper onPress={onPressMenu} testID="group_top_bar.option_menu">
        <Icon icon={'EllipsisH'} tintColor={theme.colors.iconTint} />
      </ButtonWrapper>
    );
  };

  const renderChatIcon = () => {
    return (
      <ButtonWrapper onPress={onPressChat} testID="group_top_bar.chat">
        <Icon
          icon={'iconChat'}
          size={24}
          tintColor={theme.colors.iconTint}
          style={styles.iconShieldStar}
        />
        <NotificationsBadge.Alert
          style={styles.badge}
          number={count}
          maxNumber={99}
        />
      </ButtonWrapper>
    );
  };

  return (
    <View style={styles.container} testID="group_top_bar">
      <View style={styles.leftComponent}>
        {!isLaptop && (
          <Icon
            buttonTestID="group_top_bar.back"
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
    badge: {
      position: 'absolute',
      top: -6,
      right: 10,
    },
  });
};
