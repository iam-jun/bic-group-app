import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import Divider from '~/beinComponents/Divider';

interface Props {
  content: string;
  onPressEdit: () => void;
}

const Description = ({ content, onPressEdit }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { t } = useBaseHook();

  return (
    <View style={styles.constainer}>
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:text_description
        </Text.BodyM>
        <ButtonWrapper onPress={onPressEdit}>
          <Text.H6
            testID="description.edit"
            color={colors.neutral80}
            style={styles.editBtn}
            useI18n
          >
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <Text.BodyS
        testID="description.text"
        style={styles.descriptionText}
      >
        {content || t('common:text_not_set')}
      </Text.BodyS>
      <Divider style={styles.divider} />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  constainer: {
    paddingTop: spacing.padding.base,
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: spacing.padding.base,
    paddingVertical: spacing.padding.small,
    paddingLeft: spacing.padding.large,
    alignItems: 'center',
  },
  editBtn: { padding: spacing.padding.small },
  descriptionText: {
    marginHorizontal: spacing.margin.large,
    marginTop: spacing.margin.small,
  },
  divider: {
    marginVertical: spacing.margin.small,
  },
});

export default Description;
