import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import spacing from '~/theme/spacing';
import { IAccordion } from '~/interfaces/IMenu';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';

interface Props {
  data: IAccordion;
  height: number;
}

const AccordionItem = ({ data, height }: Props) => {
  const { icon, title, onPress } = data;
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <Button testID={`accordion_item_${data.type}`} style={[styles.itemContainer, { height }]} onPress={onPress}>
      <Icon tintColor={theme.colors.neutral20} size={22} icon={icon} />
      <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>
        {t(title)}
      </Text.BodyMMedium>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    textTitle: {
      marginLeft: spacing.margin.large,
      color: colors.neutral40,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.margin.big + spacing.margin.small,
    },
  });
};

export default AccordionItem;
