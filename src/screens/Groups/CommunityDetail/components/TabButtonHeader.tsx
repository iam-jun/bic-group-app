import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native'
import TabButton from '~/beinComponents/TabButton'
import ViewSpacing from '~/beinComponents/ViewSpacing'
import { spacing } from '~/theme'
import { useRootNavigation } from '~/hooks/navigation'
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack'

interface TabButtonHeaderProps {
  communityId: string;
  isMember: boolean
}

const TabButtonHeader = ({ communityId, isMember }: TabButtonHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const onPressDiscover = () => {
    rootNavigation.navigate(
      groupStack.discoverGroups, { communityId },
    );
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.communityAbout);
  };

  const onPressMembers = () => {
    rootNavigation.navigate(
      groupStack.communityMembers, { communityId },
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      style={styles.container}
      contentContainerStyle={styles.buttonContainer}
    >
      <TabButton useI18n testID="tab_info_header.about_btn" size="medium" onPress={onPressAbout}>
        groups:group_content:btn_about
      </TabButton>
      <ViewSpacing width={spacing.margin.small} />
      {isMember && (
      <>
        <TabButton useI18n testID="tab_info_header.discover_btn" size="medium" onPress={onPressDiscover}>
          groups:group_content:btn_discover
        </TabButton>
        <ViewSpacing width={spacing.margin.small} />
      </>
      )}
      <TabButton useI18n testID="tab_info_header.members_btn" size="medium" onPress={onPressMembers}>
        groups:group_content:btn_members
      </TabButton>
    </ScrollView>
  )
}

export default TabButtonHeader

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.tiny,
      backgroundColor: colors.white,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.white,
    },
  })
}
