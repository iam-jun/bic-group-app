import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

interface DraftFooterProps {
  isProcessing: boolean;
  isPublishing: boolean;
  shouldDisableButtonPublish: boolean;
  onPressDelete: () => void;
  onPressEdit: () => void;
  onPressPublish: () => void
}

const DraftFooter = ({
  isProcessing,
  isPublishing,
  shouldDisableButtonPublish,
  onPressDelete,
  onPressEdit,
  onPressPublish,
}: DraftFooterProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();

  if (isProcessing) {
    return (
      <Text.BodyS color={colors.gray50} style={styles.draftText}>
        {t('post:draft:text_processing_publish')}
      </Text.BodyS>
    );
  }

  return (
    <View style={[styles.row, styles.footerButtonContainer]}>
      <View style={styles.row}>
        <Button.Danger
          testID="draft_footer.delete"
          type="ghost"
          icon="TrashCanSolid"
          onPress={onPressDelete}
        />
        <ViewSpacing width={16} />
        <Button.Secondary testID="draft_footer.edit" type="ghost" icon="PenToSquareSolid" onPress={onPressEdit} />
      </View>
      <Button.Primary
        testID="draft_footer.publish"
        useI18n
        size="medium"
        loading={isPublishing}
        disabled={shouldDisableButtonPublish}
        onPress={onPressPublish}
      >
        common:btn_publish
      </Button.Primary>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  draftText: {
    marginVertical: spacing.margin.small,
    marginHorizontal: spacing.margin.large,
  },
  row: {
    flexDirection: 'row',
  },
  footerButtonContainer: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.small,
    justifyContent: 'space-between',
  },
});

export default DraftFooter;
