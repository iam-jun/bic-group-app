import {View, StyleSheet} from 'react-native';
import React, {Fragment} from 'react';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import images from '~/resources/images';
import {scaleCoverHeight} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import privacyTypes from '~/constants/privacyTypes';
import i18next from 'i18next';

const InfoHeader = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {name, user_count, background_img_url, icon, privacy} = infoDetail;
  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon: iconPrivacy, privacyTitle}: any = privacyData || {};

  const renderCoverImage = () => {
    return (
      <View testID="community_info_header.cover">
        <Image
          style={styles.cover}
          source={background_img_url || images.img_cover_default}
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
        <View>
          <Text.BodyM testID="community_info_header.name">{name}</Text.BodyM>
          <View style={styles.info}>
            <Icon
              icon={iconPrivacy}
              size={16}
              tintColor={theme.colors.textSecondary}
            />
            <Text.BodyS
              color={theme.colors.textSecondary}
              testID="community_info_header.privacy">
              {` ${i18next.t(privacyTitle)}`}
            </Text.BodyS>
            <Text.BodyS color={theme.colors.textSecondary}> • </Text.BodyS>
            <Icon
              icon={'UsersAlt'}
              size={16}
              tintColor={theme.colors.textSecondary}
            />
            <Text.BodyS
              color={theme.colors.textSecondary}
              testID="community_info_header.member_count">
              {` ${user_count} ${i18next.t('groups:text_members', {
                count: user_count,
              })}`}
            </Text.BodyS>
          </View>
        </View>
      </View>
    );
  };

  const renderJoinButton = () => {
    return (
      <Fragment>
        <Button.Secondary
          testID="info_header.join"
          leftIcon={'Plus'}
          leftIconProps={{icon: 'Plus', size: 20}}
          style={styles.btnJoin}
          // onPress={onPressJoin}
          color={theme.colors.primary6}
          textColor={theme.colors.background}
          colorHover={theme.colors.primary6}
          useI18n>
          communities:text_join_community_button
        </Button.Secondary>
        <View style={styles.shortDesc}>
          <Text.Subtitle color={theme.colors.textSecondary} useI18n>
            communities:text_join_community_description
          </Text.Subtitle>
        </View>
      </Fragment>
    );
  };

  return (
    <View>
      {renderCoverImage()}
      {renderInfoHeader()}
      {renderJoinButton()}
    </View>
  );
};

export default InfoHeader;

const themeStyles = (theme: ITheme) => {
  const {dimension, spacing} = theme;
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
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnJoin: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.padding.small,
      padding: spacing.padding.base,
    },
    shortDesc: {
      alignSelf: 'center',
    },
  });
};
