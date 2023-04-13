import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import CommunityJoinedGroupTree from './CommunityJoinedGroupTree';
import useModalStore from '~/store/modal';

interface TabButtonHeaderProps {
  isMember: boolean;
  communityId: string;
  teamName: string;
  onPressDiscover?: () => void;
  onPressAbout?: () => void;
  onPressMembers?: () => void;
  onPressTags?: () => void;
}

const TabButtonHeader = ({
  isMember,
  communityId,
  teamName,
  onPressDiscover,
  onPressAbout,
  onPressMembers,
  onPressTags,
}: TabButtonHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const actions = useModalStore((state) => state.actions);

  const onPressYourGroups = () => {
    actions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: 'groups:group_content:btn_your_groups',
      ContentComponent: (
        <CommunityJoinedGroupTree
          communityId={communityId}
          teamName={teamName}
        />
      ),
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      style={styles.container}
      contentContainerStyle={styles.buttonContainer}
    >
      {onPressAbout && (
        <>
          <PillTabButton
            useI18n
            testID="tab_button_header.about_btn"
            size="medium"
            onPress={onPressAbout}
          >
            groups:group_content:btn_about
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {isMember && (
        <>
          <PillTabButton
            useI18n
            testID="tab_button_header.your_groups"
            size="medium"
            onPress={onPressYourGroups}
          >
            groups:group_content:btn_your_groups
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {isMember && onPressDiscover && (
        <>
          <PillTabButton
            useI18n
            testID="tab_button_header.discover_btn"
            size="medium"
            onPress={onPressDiscover}
          >
            groups:group_content:btn_browse
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {onPressMembers && (
        <>
          <PillTabButton
            useI18n
            testID="tab_button_header.members_btn"
            size="medium"
            onPress={onPressMembers}
          >
            groups:group_content:btn_members
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {onPressTags && (
        <PillTabButton
          useI18n
          testID="tab_button_header.tags_btn"
          size="medium"
          onPress={onPressTags}
        >
          groups:group_content:btn_tags
        </PillTabButton>
      )}
    </ScrollView>
  );
};

export default TabButtonHeader;

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
  });
};
