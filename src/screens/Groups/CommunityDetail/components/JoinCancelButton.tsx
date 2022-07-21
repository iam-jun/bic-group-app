import React, { Fragment } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacy } from '~/constants/privacyTypes';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import spacing from '~/theme/spacing';

interface JoinCancelButtonProps {
  style?: ViewStyle;
}

const JoinCancelButton = ({ style }: JoinCancelButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    privacy,
    join_status,
    id: communityId,
    name: communityName,
  } = infoDetail;
  const isPrivate = privacy === groupPrivacy.private;
  const isMember = join_status === groupJoinStatus.member;
  const hasRequested = join_status === groupJoinStatus.requested;

  if (isMember) return null;

  const onPressJoin = () => {
    dispatch(groupsActions.joinCommunity({ communityId, communityName }));
  };

  const onPressCancelRequest = () => {
    dispatch(groupsActions.cancelJoinCommunity({ communityId, communityName }));
  };

  return (
    <View style={[styles.buttonView, style]} testID="join_cancel_button">
      {hasRequested ? (
        <Button.Secondary
          testID="join_cancel_button.cancel"
          style={styles.btnAction}
          color={theme.colors.gray20}
          textColor={theme.colors.neutral80}
          onPress={onPressCancelRequest}
          useI18n
        >
          common:btn_cancel_request
        </Button.Secondary>
      ) : (
        <Button.Secondary
          testID="join_cancel_button.join"
          leftIcon="Plus"
          leftIconProps={{ icon: 'Plus', size: 20 }}
          style={styles.btnAction}
          color={theme.colors.purple50}
          textColor={theme.colors.white}
          colorHover={theme.colors.purple50}
          onPress={onPressJoin}
          useI18n
        >
          communities:text_join_community_button
        </Button.Secondary>
      )}

      {isPrivate && (
      <View style={styles.shortDesc}>
        <Text.BodyS
          color={theme.colors.gray50}
          useI18n
          testID="join_cancel_button.description"
        >
          communities:text_join_community_description
        </Text.BodyS>
      </View>
      )}
    </View>
  );
};

export default JoinCancelButton;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    btnAction: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.padding.small,
      padding: spacing.padding.base,
    },
    shortDesc: {
      alignSelf: 'center',
    },
    buttonView: {
      backgroundColor: colors.white,
      paddingBottom: spacing.padding.small,
    },
  });
};
