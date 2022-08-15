import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  View, StyleSheet, Platform, TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { spacing } from '~/theme';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import ButtonCommunityGroupCardAction from './ButtonCommunityGroupCardAction';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupsActions from '~/storeRedux/groups/actions';

type CommunityGroupCardProps = {
  item: any;
  testID?: string;
};

const Index: FC<CommunityGroupCardProps> = (props) => {
  const { item, testID } = props;
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

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
    <View testID={testID} style={[styles.container, styles.bottomBorderAndShadow]}>
      <TouchableWithoutFeedback onPress={onView}>
        <View>
          <View style={styles.row}>
            <Image resizeMode="contain" style={styles.img} source={icon} />
            <View style={styles.containerInfo}>
              <Text.H6 numberOfLines={2} ellipsizeMode="tail">
                {name}
              </Text.H6>
              <View style={styles.spaceInfoAndName} />
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
                <View style={styles.spacePrivacyAndMember} />
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
          <View style={styles.spaceDescAndRowAbove} />
          <Text.BodyM numberOfLines={2} ellipsizeMode="tail">
            {`${description} `}
          </Text.BodyM>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.spaceButtonAndDesc} />
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
    img: {
      height: 76,
      width: 76,
      borderRadius: spacing.borderRadius.large,
      marginRight: 10,
    },
    containerInfo: {
      flex: 1,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
      height: 16,
    },
    spaceInfoAndName: {
      height: 4,
    },
    spaceDescAndRowAbove: {
      height: 10,
    },
    spacePrivacyAndMember: {
      width: 32,
    },
    textNumberMember: {
      marginRight: spacing.margin.small,
    },
    spaceButtonAndDesc: {
      height: spacing.margin.base,
    },
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.neutral5,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  });
};

export default Index;
