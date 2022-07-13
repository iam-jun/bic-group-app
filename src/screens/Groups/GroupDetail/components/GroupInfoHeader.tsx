import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {scaleCoverHeight} from '~/theme/dimension';
import groupsActions from '../../redux/actions';
import {useBaseHook} from '~/hooks';
import privacyTypes from '~/constants/privacyTypes';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import groupJoinStatus from '~/constants/groupJoinStatus';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

const GroupInfoHeader = () => {
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const theme = useTheme() as ExtendedTheme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const {t} = useBaseHook();

  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group);
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;
  const hasRequested = join_status === groupJoinStatus.requested;
  const {
    id: groupId,
    name: groupName,
    user_count,
    icon,
    background_img_url,
    privacy,
  } = groupDetail;

  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon: iconPrivacy, privacyTitle}: any = privacyData || {};

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderCoverImage = () => {
    return (
      <View onLayout={onCoverLayout} testID="group_info_header.cover">
        <Image
          style={styles.cover}
          source={background_img_url || images.img_cover_default}
        />
      </View>
    );
  };

  const renderGroupInfoHeader = () => {
    return (
      <View style={styles.nameHeader}>
        <Text.H4 style={styles.nameHeader} testID="group_info_header.name">
          {groupName}
        </Text.H4>
        <View style={styles.groupInfo}>
          <Icon
            style={styles.iconSmall}
            icon={iconPrivacy}
            size={16}
            tintColor={theme.colors.neutral80}
          />
          <Text.Subtitle testID="group_info_header.privacy" useI18n>
            {privacyTitle}
          </Text.Subtitle>
          <Text.Subtitle> • </Text.Subtitle>
          <Text.BodySM testID="group_info_header.member_count">
            {user_count}
          </Text.BodySM>
          <Text.Subtitle>{` ${t('groups:text_members', {
            count: user_count,
          })}`}</Text.Subtitle>
        </View>
      </View>
    );
  };

  const onPressJoin = () => {
    dispatch(groupsActions.joinNewGroup({groupId, groupName}));
  };

  const onPressCancelRequest = () => {
    dispatch(groupsActions.cancelJoinGroup({groupId, groupName}));
  };

  const renderJoinButton = () => {
    if (isMember) return null;

    return (
      <Button.Secondary
        testID="group_info_header.join"
        rightIcon={'Plus'}
        rightIconProps={{icon: 'Plus', size: 20}}
        style={styles.btnGroupAction}
        onPress={onPressJoin}
        color={theme.colors.purple60}
        textColor={theme.colors.white}
        colorHover={theme.colors.purple50}
        useI18n>
        common:btn_join
      </Button.Secondary>
    );
  };

  const renderCancelRequestButton = () => {
    return (
      <Button.Secondary
        testID="group_info_header.cancel"
        style={styles.btnGroupAction}
        onPress={onPressCancelRequest}
        textColor={theme.colors.purple60}
        useI18n>
        common:btn_cancel_request
      </Button.Secondary>
    );
  };

  return (
    <View style={styles.coverAndInfoHeader} testID="group_info_header">
      {renderCoverImage()}

      {/* Group info header */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Avatar.Large source={icon} style={styles.avatar} />
          <View style={styles.groupInfoHeaderContainer}>
            {renderGroupInfoHeader()}
          </View>
          {hasRequested ? renderCancelRequestButton() : renderJoinButton()}
        </View>
      </View>
    </View>
  );
};

export default GroupInfoHeader;

const themeStyles = (theme: ExtendedTheme, coverHeight: number) => {
  const {colors} = theme;
  return StyleSheet.create({
    infoContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginRight: spacing?.margin.large,
    },
    groupInfoHeaderContainer: {
      flex: 1,
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
      height: 16,
    },
    coverAndInfoHeader: {
      backgroundColor: colors.white,
    },
    headerIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameHeader: {},
    btnGroupAction: {
      marginLeft: spacing.margin.large,
      alignSelf: 'flex-start',
    },
  });
};
