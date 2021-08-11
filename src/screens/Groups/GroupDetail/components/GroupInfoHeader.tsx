import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Image from '~/beinComponents/Image';
import Icon from '~/beinComponents/Icon';
import {scaleSize} from '~/theme/dimension';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import useGroups from '~/hooks/groups';
import {titleCase} from '~/utils/common';

const GroupInfoHeader = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const groupData = useGroups();
  const {groupDetail} = groupData || {};
  const {name, user_count, icon, background_img_url, privacy} =
    groupDetail?.group || {};

  return (
    <View style={styles.coverAndInfoHeader}>
      {/* Cover photo */}
      <Image
        style={styles.cover}
        source={background_img_url || images.img_cover_default}
      />

      {/* Group info header */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Avatar.UltraLarge source={icon} style={styles.avatar} />
          <View style={styles.nameHeader}>
            <ButtonWrapper
              textProps={{
                variant: 'h5',
              }}>
              {name}
            </ButtonWrapper>

            <View style={styles.groupInfoText}>
              <Icon
                style={styles.iconSmall}
                icon={'iconPrivate'}
                size={14}
                tintColor={theme.colors.iconTint}
              />
              <Text.BodyS useI18n>{!!privacy && titleCase(privacy)}</Text.BodyS>
              <Text.Subtitle> ⬩ </Text.Subtitle>
              <Icon
                style={styles.iconSmall}
                icon={'UsersAlt'}
                size={16}
                tintColor={theme.colors.iconTint}
              />
              <Text.BodySM>{user_count}</Text.BodySM>
            </View>
          </View>
          <ButtonWrapper
            style={styles.chatButton}
            onPress={() => alert('go to chat group')}>
            <Icon
              style={styles.iconSmall}
              icon={'iconMessages'}
              size={32}
              tintColor={theme.colors.iconTint}
            />
          </ButtonWrapper>
        </View>
      </View>
    </View>
  );
};

export default GroupInfoHeader;

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    infoContainer: {
      paddingHorizontal: spacing?.padding.large,
      paddingVertical: spacing?.padding.base,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginRight: spacing?.margin.base,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
    },
    iconSmall: {
      marginRight: spacing?.margin.tiny,
    },
    coverAndInfoHeader: {
      backgroundColor: colors.background,
    },
    headerIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing?.margin.large,
      marginVertical: spacing?.margin.small,
    },
    chatButton: {
      backgroundColor: colors.bgButtonSecondary,
      padding: spacing.padding.tiny,
      borderRadius: 6,
    },
    groupInfoText: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
    },
    nameHeader: {flex: 1},
  });
};
