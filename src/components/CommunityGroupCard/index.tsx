import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { spacing } from '~/theme';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ButtonCommunityGroupCardAction from './ButtonCommunityGroupCardAction';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupsActions from '~/storeRedux/groups/actions';
import { Button } from '~/baseComponents';

type CommunityGroupCardProps = {
  item: any;
  testID?: string;
};

const Index: FC<CommunityGroupCardProps> = ({ item, testID }) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors, elevations } = theme;

  const {
    id, name, icon, userCount, privacy, joinStatus, description,
  }
    = item || {};
  const privacyData: any
    = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon, title: privacyTitle } = privacyData || {};

  const onView = () => {
    rootNavigation.navigate(groupStack.communityDetail, { communityId: id });
  };

  const onJoin = () => {
    dispatch(
      groupsActions.joinCommunity({ communityId: id, communityName: name }),
    );
  };

  const onCancel = () => {
    dispatch(
      groupsActions.cancelJoinCommunity({
        communityId: id,
        communityName: name,
      }),
    );
  };

  return (
    <View testID={testID} style={[styles.container, elevations.e1]}>
      <Button TouchableComponent={TouchableWithoutFeedback} onPress={onView}>
        <View>
          <View style={styles.row}>
            <Image
              resizeMode="contain"
              containerStyle={styles.imgContainer}
              style={styles.img}
              source={icon}
            />
            <View style={styles.containerInfo}>
              <Text.H6 numberOfLines={2}>{name}</Text.H6>
              <ViewSpacing height={spacing.margin.tiny} />
              <View style={styles.row}>
                <View style={styles.row}>
                  <Icon
                    style={styles.iconSmall}
                    icon={privacyIcon}
                    size={16}
                    tintColor={colors.gray50}
                  />
                  <Text.BodyS color={colors.neutral40} useI18n>
                    {privacyTitle}
                  </Text.BodyS>
                </View>
                <ViewSpacing width={spacing.margin.big} />
                <View style={styles.row}>
                  <Text.BodySMedium style={styles.textNumberMember}>
                    {userCount}
                  </Text.BodySMedium>
                  <Text.BodyS color={colors.neutral40} useI18n>
                    common:members
                  </Text.BodyS>
                </View>
              </View>
            </View>
          </View>
          <ViewSpacing height={10} />
          <Text.BodyM numberOfLines={2}>{`${description}`}</Text.BodyM>
        </View>
      </Button>
      <ViewSpacing height={spacing.margin.base} />
      <ButtonCommunityGroupCardAction
        joinStatus={joinStatus}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingTop: 10,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    imgContainer: {
      height: 80,
      width: 80,
      borderRadius: spacing.borderRadius.small,
      padding: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray1,
      marginRight: 10,
    },
    img: {
      height: 76,
      width: 76,
      borderRadius: spacing.borderRadius.large,
    },
    containerInfo: {
      flex: 1,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
      height: 16,
    },
    textNumberMember: {
      marginRight: spacing.margin.small,
    },
  });
};

export default Index;
