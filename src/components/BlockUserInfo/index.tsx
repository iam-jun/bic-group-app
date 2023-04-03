import {
  ScrollView, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { Button } from '~/baseComponents';

interface Props {
  fullname: string;
  style?: StyleProp<ViewStyle>;
  onConfirmBlock?: () => void;
  onCancelBlock?: () => void;
}

const BlockUserInfo = ({
  fullname, style, onConfirmBlock, onCancelBlock,
}: Props) => {
  const { t } = useBaseHook();
  const theme = useTheme() as ExtendedTheme;
  const { colors } = theme;

  const renderLine = (content: string) => (
    <View style={styles.textLine}>
      <Text.BodyM color={colors.neutral80} useI18n>
        {'   • '}
      </Text.BodyM>
      <Text.BodyM color={colors.neutral80} useI18n>
        {content}
      </Text.BodyM>
    </View>
  );

  if (!fullname) return null;

  return (
    <ScrollView style={style} testID="block_user_info">
      {onConfirmBlock && <Text.H4>{t('block_user:title_block_name').replace('{0}', fullname)}</Text.H4>}
      <Text.BodyM style={onConfirmBlock && styles.textDescription} color={colors.neutral80} useI18n>
        block_user:general_description
      </Text.BodyM>
      <ViewSpacing height={spacing.margin.tiny} />
      <Text.BodyM color={colors.neutral80}>{`${fullname} ${t('block_user:cannot:title')}`}</Text.BodyM>
      {renderLine('block_user:cannot:search_profile')}
      {renderLine('block_user:cannot:mention')}
      {renderLine('block_user:cannot:send_message')}
      <ViewSpacing height={spacing.margin.tiny} />
      <Text.LabelM color={colors.neutral80}>{`${fullname} ${t('block_user:can:title')}`}</Text.LabelM>
      {renderLine('block_user:can:see_profile')}
      {renderLine('block_user:can:see_content')}
      {onConfirmBlock && (
        <View>
          <Button.Primary testID="block_user_info.btn_confirm" style={styles.btnConfirm} onPress={onConfirmBlock}>
            {t('common:btn_confirm')}
          </Button.Primary>
          <Button.Neutral testID="block_user_info.btn_cancel" style={styles.btnCancel} type="ghost" onPress={onCancelBlock}>
            {t('common:btn_cancel')}
          </Button.Neutral>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textDescription: {
    marginTop: spacing.margin.large,
  },
  textLine: {
    flexDirection: 'row',
  },
  btnConfirm: {
    marginTop: spacing.margin.large + spacing.margin.tiny,
  },
  btnCancel: {
    marginTop: spacing.margin.small + spacing.margin.xTiny,
  },
});

export default BlockUserInfo;
