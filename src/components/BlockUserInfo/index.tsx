import {
  StyleProp, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface Props {
  fullname: string;
  style?: StyleProp<ViewStyle>;
}

const BlockUserInfo = ({ fullname, style }: Props) => {
  const { t } = useBaseHook();
  const theme = useTheme() as ExtendedTheme;
  const { colors } = theme;

  const renderLine = (content: string) => (
    <Text>
      <Text.LabelM color={colors.neutral80} useI18n>{'   • '}</Text.LabelM>
      <Text.LabelM color={colors.neutral80} useI18n>{content}</Text.LabelM>
    </Text>
  );

  if (!fullname) return null;

  return (
    <View style={style}>
      <Text.LabelM color={colors.neutral80} useI18n>block_user:general_description</Text.LabelM>
      <ViewSpacing height={spacing.margin.large} />
      <Text.LabelM color={colors.neutral80}>
        {`${fullname} ${t('block_user:cannot:title')}`}
      </Text.LabelM>
      {renderLine('block_user:cannot:search_profile')}
      {renderLine('block_user:cannot:mention')}
      {renderLine('block_user:cannot:send_message')}
      <ViewSpacing height={spacing.margin.small} />
      <Text.LabelM color={colors.neutral80}>
        {`${fullname} ${t('block_user:can:title')}`}
      </Text.LabelM>
      {renderLine('block_user:can:see_profile')}
      {renderLine('block_user:can:see_content')}
    </View>
  );
};

export default BlockUserInfo;
