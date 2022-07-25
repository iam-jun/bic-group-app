import {View, StyleSheet} from 'react-native';
import React from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';
import dimension, {scaleCoverHeight} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import privacyTypes from '~/constants/privacyTypes';
import i18next from 'i18next';
import spacing from '~/theme/spacing';

const InfoHeader = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {name, userCount, backgroundImgUrl, icon, privacy} = infoDetail;
  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon: iconPrivacy, privacyTitle}: any = privacyData || {};

  const renderCoverImage = () => {
    return (
      <View testID="info_header.cover">
        <Image
          style={styles.cover}
          source={backgroundImgUrl || images.img_cover_default}
        />
      </View>
    );
  };

  const renderInfoHeader = () => {
    return (
      <View style={styles.infoContainer}>
        <Avatar.Large
          source={icon || images.img_user_avatar_default}
          style={styles.avatar}
        />
        <View style={{flex: 1}}>
          <Text.H6 testID="info_header.name">{name}</Text.H6>
          <View style={styles.info}>
            <Icon
              icon={iconPrivacy}
              size={16}
              tintColor={theme.colors.neutral80}
            />
            <Text.BodyS
              color={theme.colors.gray50}
              testID="info_header.privacy">
              {` ${i18next.t(privacyTitle)}`}
            </Text.BodyS>
            <Text.BodyS color={theme.colors.gray50}> • </Text.BodyS>
            <Icon
              icon={'UserGroup'}
              size={16}
              tintColor={theme.colors.neutral80}
            />
            <Text.BodyS
              color={theme.colors.gray50}
              testID="info_header.member_count">
              {` ${userCount} ${i18next.t('groups:text_members', {
                count: userCount,
              })}`}
            </Text.BodyS>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View testID="info_header">
      {renderCoverImage()}
      {renderInfoHeader()}
    </View>
  );
};

export default InfoHeader;

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    cover: {
      width: dimension.deviceWidth,
      height: scaleCoverHeight(dimension.deviceWidth),
    },
    avatar: {
      // top: -5,
      marginRight: spacing.margin.base,
    },
    infoContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};
