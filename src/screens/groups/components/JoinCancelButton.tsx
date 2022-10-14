import {
  View, StyleProp, ViewStyle, StyleSheet,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Button from '~/baseComponents/Button';
import { spacing } from '~/theme';
import { CommunityPrivacyType, GroupPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

interface JoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
  type: 'community' | 'group';
  joinStatus: number;
  privacy: GroupPrivacyType | CommunityPrivacyType;
  onPressJoin: () => void;
  onPressCancelRequest: () => void;
}

const JoinCancelButton = ({
  style, type, joinStatus, onPressJoin, onPressCancelRequest,
}: JoinCancelButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;

  return (
    <View style={[styles.buttonView, style]} testID="join_cancel_button">
      {hasRequested ? (
        <Button.Neutral
          testID="join_cancel_button.cancel"
          onPress={onPressCancelRequest}
          useI18n
        >
          common:btn_cancel_request
        </Button.Neutral>
      ) : (
        <Button.Secondary
          testID="join_cancel_button.join"
          onPress={onPressJoin}
          useI18n
        >
          {`communities:text_join_${type}_button`}
        </Button.Secondary>
      )}
    </View>
  );
};

export default JoinCancelButton;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    buttonView: {
      backgroundColor: colors.white,
      paddingTop: spacing.padding.xSmall,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};
