import {View, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import ListView from '~/beinComponents/list/ListView';
import Button from '~/beinComponents/Button';
import InfoHeader from './InfoHeader';
import {ITheme} from '~/theme/interfaces';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import JoinCancelButton from './JoinCancelButton';

interface PageContentProps {
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
}

const PageContent = ({onScroll, onButtonLayout}: PageContentProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme || {};
  const styles = createStyles(theme);

  const onPressAbout = () => {
    // TODO: add navigation to About page
  };

  const onPressMembers = () => {
    // TODO: add navigation to Members page
  };

  const renderHeader = () => {
    return (
      <View onLayout={onButtonLayout}>
        <InfoHeader />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          style={styles.scrollViewBtn}
          contentContainerStyle={styles.buttonContainer}>
          <Button.Secondary
            useI18n
            color={colors.bgHover}
            textColor={colors.textPrimary}
            borderRadius={spacing.borderRadius.small}
            testID="page_content.about_btn"
            onPress={onPressAbout}>
            groups:group_content:btn_about
          </Button.Secondary>
          <ViewSpacing width={spacing.margin.small} />
          <Button.Secondary
            useI18n
            color={colors.bgHover}
            textColor={colors.textPrimary}
            borderRadius={spacing.borderRadius.small}
            testID="page_content.members_btn"
            onPress={onPressMembers}>
            groups:group_content:btn_members
          </Button.Secondary>
        </ScrollView>
        <JoinCancelButton />
      </View>
    );
  };

  return (
    <ListView
      isFullView
      style={styles.listContainer}
      data={[]}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={theme.spacing.padding.base} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing.margin.base} />
      )}
    />
  );
};

export default PageContent;

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
    },
    listHeaderComponentStyle: {
      marginBottom: spacing.margin.base,
    },
    scrollViewBtn: {
      paddingBottom: spacing.padding.tiny,
      backgroundColor: colors.background,
    },
  });
};
