import {
  View, StyleProp, ViewStyle, StyleSheet,
} from 'react-native'
import React from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { COMMUNITY_PRIVACY_TYPE, groupPrivacy, GROUP_PRIVACY_TYPE } from '~/constants/privacyTypes';

interface JoinCancelButtonProps {
  style?: StyleProp<ViewStyle>;
  type: 'community' | 'group';
  joinStatus: number;
  privacy: GROUP_PRIVACY_TYPE | COMMUNITY_PRIVACY_TYPE;
  onPressJoin: () => void;
  onPressCancelRequest: () => void;
}

const JoinCancelButton = ({
  style, type, joinStatus, privacy, onPressJoin, onPressCancelRequest,
}: JoinCancelButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const hasRequested = joinStatus === groupJoinStatus.requested;
  const isPrivate = privacy === groupPrivacy.private;

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
          {`communities:text_join_${type}_button`}
        </Button.Secondary>
      )}

      {isPrivate && (
        <View style={styles.shortDesc}>
          <Text.BodyS
            color={theme.colors.gray50}
            useI18n
            testID="join_cancel_button.description"
          >
            {`communities:text_join_${type}_description`}
          </Text.BodyS>
        </View>
      )}
    </View>
  );
}

export default JoinCancelButton

const createStyles = (theme: ExtendedTheme) => {
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
