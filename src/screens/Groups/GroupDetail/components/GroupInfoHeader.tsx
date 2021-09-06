import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {titleCase} from '~/utils/common';
import {ITheme} from '~/theme/interfaces';
import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {scaleCoverHeight} from '~/theme/dimension';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';

const GroupInfoHeader = () => {
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, coverHeight);
  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group);
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
        <ButtonWrapper textProps={{variant: 'h5'}}>{name}</ButtonWrapper>

        <View style={styles.groupInfoText}>
          <Icon
            style={styles.iconSmall}
            icon={'iconPrivate'}
            size={14}
            tintColor={theme.colors.iconTint}
          />
          <Text.BodySM useI18n>{titleCase(privacy)}</Text.BodySM>
          <Text.BodySM>{`  ⬩  `}</Text.BodySM>
          <Icon
            style={styles.iconSmall}
            icon={'UsersAlt'}
            size={16}
            tintColor={theme.colors.iconTint}
          />
          <Text.BodySM>{user_count}</Text.BodySM>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.coverAndInfoHeader}>
      {renderCoverImage()}

      {/* Group info header */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Avatar.UltraLarge source={icon} style={styles.avatar} />
          {renderGroupInfoHeader()}
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
    cover: {
      width: '100%',
      height: coverHeight,
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
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
    groupInfoText: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      alignItems: 'center',
    },
    nameHeader: {flex: 1},
  });
};
