import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatData';
import { Button } from '~/baseComponents';
import modalActions from '~/storeRedux/modal/actions';
import UserInterestedPost from '~/components/posts/UserInterestedPost';

export interface ContentInterestedUserCountProps {
  id: string;
  testIDPrefix?: string;
  style?: StyleProp<ViewStyle>;
  labelColor?: string;
  interestedUserCount?: number;
}

const ContentInterestedUserCount: FC<ContentInterestedUserCountProps> = ({
  id,
  testIDPrefix,
  style,
  labelColor,
  interestedUserCount = 0,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const labelColorInterested = labelColor || colors.neutral40;
  const peopleCount = formatLargeNumber(interestedUserCount);
  const testID = `${testIDPrefix ? `${testIDPrefix}.` : ''}content_interested_user_count`;

  const onPressInterestedBy = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        isFullScreen: true,
        titleFullScreen: t('post:label_seen_by'),
        ContentComponent: <UserInterestedPost postId={id} />,
      }),
    );
  };

  return (
    <View
      testID={testID}
      style={[styles.container, style]}
    >
      <Button
        onPress={onPressInterestedBy}
        activeOpacity={1}
        testID={`${testID}.button`}
      >
        <Text.BodyS
          color={labelColorInterested}
          numberOfLines={1}
          testID={`${testID}.show_text`}
        >
          {t('post:label_seen_by')}
          <Text.BodySMedium color={labelColorInterested}>{peopleCount}</Text.BodySMedium>
        </Text.BodyS>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingTop: spacing.padding.base,
    paddingBottom: spacing.padding.xSmall,
    paddingHorizontal: spacing.padding.large,
  },
});

export default ContentInterestedUserCount;
