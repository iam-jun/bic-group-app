import {View, StyleSheet} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import {ITheme} from '~/theme/interfaces';

const AboutContent = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <View style={styles.descriptionSection}>
        <Text.BodyM style={styles.titleDescription} useI18n>
          common:text_description
        </Text.BodyM>
        <CollapsibleText
          limitLength={200}
          shortLength={200}
          textProps={{variant: 'body'}}
          content={`Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
Đây là Text và hình ảnh. Erat sed có quá nhiều vấn đề sed fermentum ipsum vel quis quam. Nu Tech People Working on Bein platform
`}
        />
      </View>
      <MenuItem
        testID="about_content.privacy"
        icon={'LockAlt'}
        title={i18next.t('Private')}
        disabled
      />
      <MenuItem
        testID="about_content.privacy"
        icon={'UsersAlt'}
        title={i18next.t('123.345 members')}
        disabled
      />
    </View>
  );
};

export default AboutContent;

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginVertical: spacing.margin.large,
    },
    titleDescription: {
      marginBottom: spacing.margin.large,
    },
    descriptionSection: {
      paddingHorizontal: spacing.padding.large,
      marginVertical: spacing.margin.base,
    },
  });
};
