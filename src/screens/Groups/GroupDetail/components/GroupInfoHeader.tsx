import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {titleCase} from '~/utils/common';
import {ITheme} from '~/theme/interfaces';
import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {scaleCoverHeight} from '~/theme/dimension';
import groupsActions from '../../redux/actions';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import groupJoinStatus from '~/constants/groupJoinStatus';
import Button from '~/beinComponents/Button';

const GroupInfoHeader = () => {
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, coverHeight);
  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group);
  const join_status = useKeySelector(groupsKeySelector.groupDetail.join_status);
  const isMember = join_status === groupJoinStatus.member;
  const dispatch = useDispatch();

  const {name, user_count, icon, background_img_url, privacy} = groupDetail;

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderCoverImage = () => {
    return (
      <View onLayout={onCoverLayout}>
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
        <Text.H5 style={styles.nameHeader}>{name}</Text.H5>

        <View style={styles.groupInfo}>
          <Icon
            style={styles.iconSmall}
            icon={'iconPrivate'}
            size={16}
            tintColor={theme.colors.iconTint}
          />
          <Text.BodySM useI18n>{titleCase(privacy)}</Text.BodySM>
          <Text.BodySM>{`  ⬩  `}</Text.BodySM>
          <Icon
            style={styles.iconSmall}
            icon={'UsersAlt'}
            size={17}
            tintColor={theme.colors.iconTint}
          />
          <Text.BodySM>{user_count}</Text.BodySM>
        </View>
      </View>
    );
  };

  const onPressJoin = () => {
    const {id: groupId, name: groupName} = groupDetail;
    dispatch(groupsActions.joinNewGroup({groupId, groupName}));
  };

  const renderJoinButton = () => {
    if (isMember) return null;

    return (
      <Button.Secondary
        rightIcon={'Plus'}
        rightIconProps={{icon: 'Plus', size: 20}}
        style={styles.btnJoin}
        onPress={onPressJoin}
        color={theme.colors.primary7}
        textColor={theme.colors.background}
        colorHover={theme.colors.primary6}
        useI18n>
        common:btn_join
      </Button.Secondary>
    );
  };

  return (
    <View style={styles.coverAndInfoHeader}>
      {renderCoverImage()}

      {/* Group info header */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Avatar.LargeAlt source={icon} style={styles.avatar} />
          <View style={styles.groupInfoHeaderContainer}>
            {renderGroupInfoHeader()}
          </View>
          {renderJoinButton()}
        </View>
      </View>
    </View>
  );
};

export default GroupInfoHeader;

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {spacing, colors} = theme;
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
      marginRight: spacing?.margin.base,
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
      backgroundColor: colors.background,
    },
    headerIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    chatButton: {
      backgroundColor: colors.bgButtonSecondary,
      padding: spacing.padding.small,
      borderRadius: 6,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        web: {
          marginTop: spacing.margin.small,
        },
      }),
    },
    nameHeader: {},
    btnJoin: {
      marginLeft: spacing.margin.large,
      alignSelf: 'flex-start',
    },
  });
};
