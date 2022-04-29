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

const InfoHeader = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderCoverImage = () => {
    return (
      <View testID="community_info_header.cover">
        <Image
          style={styles.cover}
          source={
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/cover/images/original/4783a577-9fc7-496a-8f5a-fbf1179e8b76' ||
            images.img_cover_default
          }
        />
      </View>
    );
  };

  const renderInfoHeader = () => {
    return (
      <View style={styles.infoContainer}>
        <Avatar.Large
          source={images.img_user_avatar_default}
          style={styles.avatar}
        />
        <View>
          <Text.BodyM testID="community_info_header.name">
            EVOL Community
          </Text.BodyM>
          <View style={styles.info}>
            <Icon
              icon={'Lock'}
              size={16}
              tintColor={theme.colors.textSecondary}
            />
            <Text.BodyS
              color={theme.colors.textSecondary}
              testID="community_info_header.privacy">
              {` Private`}
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
              {` 123 members`}
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
