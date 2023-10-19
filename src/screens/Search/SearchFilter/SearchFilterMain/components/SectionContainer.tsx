import React, { FC, PropsWithChildren } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';

type SectionContainerProps = {
  title: string;
  onReset?: () => void;
};

const SectionContainer: FC<PropsWithChildren<SectionContainerProps>> = ({
  title,
  onReset,
  children,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text.H3 useI18n color={colors.neutral60}>
          {title}
        </Text.H3>
        {!!onReset && (
          <Button testID="section_container.btn_reset" onPress={onReset}>
            <Text.LinkM useI18n color={colors.purple50}>
              search:reset
            </Text.LinkM>
          </Button>
        )}
      </View>
      <ViewSpacing height={spacing.margin.large} />
      {children}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: 20,
      paddingBottom: spacing.padding.base,
      backgroundColor: colors.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
};

export default SectionContainer;
