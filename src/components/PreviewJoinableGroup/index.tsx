import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';
import { GroupItem, GroupList } from '../groups';
import usePreviewJoinableGroupStore from './store';
import { IGroup } from '~/interfaces/IGroup';
import { dimension } from '~/theme';
import useModalStore from '~/store/modal';
import { ICommunity } from '~/interfaces/ICommunity';
import useMemberQuestionsStore, { MembershipQuestionsInfo } from '../MemberQuestionsModal/store';
import useTermStore, { TermsInfo } from '../TermsModal/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import { ITypeGroup } from '~/interfaces/common';
import { isGroup } from '~/helpers/groups';
import { navigateToCommunityDetail, navigateToGroupDetail } from '~/router/helper';

interface PreviewJoinableGroupProps {
  group: IGroup;
}

const PreviewJoinableGroup = (props: PreviewJoinableGroupProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyle(theme);

  const { group } = props;
  const {
    id: groupId, affectedSettings, name, icon, privacy, userCount,
  } = group || {};

  const membershipQuestionActions = useMemberQuestionsStore((state) => state.actions);
  const termsActions = useTermStore((state) => state.actions);
  const { hideModal } = useModalStore((state) => state.actions);
  const { data, loading, reset } = usePreviewJoinableGroupStore((state) => state);
  const discoverGroupsActions = useDiscoverGroupsStore((state) => state.actions);

  useEffect(
    () => () => {
      reset();
    },
    [],
  );

  const onPressGroup = (group: IGroup | ICommunity) => {
    const { id: groupId, communityId } = group || {};
    hideModal();
    if (!isGroup(group)) {
      navigateToCommunityDetail({ communityId });
    } else {
      navigateToGroupDetail({ groupId, communityId });
    }
  };

  const onPressJoin = () => {
    hideModal();

    if (affectedSettings?.isActiveMembershipQuestions) {
      const payload: MembershipQuestionsInfo = {
        groupId,
        name,
        icon,
        privacy,
        userCount,
        rootGroupId: groupId,
        type: ITypeGroup.GROUP,
        isActive: true,
        isActiveGroupTerms: affectedSettings?.isActiveGroupTerms,
      };
      membershipQuestionActions.setMembershipQuestionsInfo(payload);
      return;
    }

    if (affectedSettings?.isActiveGroupTerms) {
      const payload = {
        groupId,
        rootGroupId: groupId,
        name,
        icon,
        privacy,
        userCount,
        type: ITypeGroup.GROUP,
        isActive: true,
      } as TermsInfo;
      termsActions.setTermInfo(payload);
      return;
    }

    discoverGroupsActions.joinNewGroup(groupId);
  };

  const level = group?.level || 0;
  const firstLevel = data[0]?.level || 0;
  const paddingLeftLastGroupItem
    = 20 + spacing.padding.small * 3 + (level - firstLevel) * (spacing.padding.small * 2 + 1);

  const renderItemTitle = () => (
    <Text.BodyXS color={theme.colors.blue50} numberOfLines={1} useI18n>
      previewJoinableGroup:text_you_are_asking_to_join
    </Text.BodyXS>
  );

  return (
    <ScreenWrapper testID="preview_joinable_group">
      <Text.H3 style={styles.title} useI18n>
        previewJoinableGroup:title
      </Text.H3>
      <GroupList
        mode="tree"
        resetOnHide={false}
        data={data}
        loading={loading}
        onPressItem={onPressGroup}
        styleList={styles.list}
        styleListFooter={styles.listFooter}
        itemProps={{ isNotCollapsible: true, isDisableLastItem: true }}
      />
      {!loading && (
        <>
          <GroupItem
            style={[styles.lastGroupItem, { paddingLeft: paddingLeftLastGroupItem }]}
            item={group}
            onPress={onPressGroup}
            nameLines={1}
            renderItemTitle={renderItemTitle}
          />
          <View style={styles.descriptionContainer}>
            <Icon icon="CircleInfo" size={18} tintColor={theme.colors.blue50} />
            <Text.BodyM style={styles.textDescriptionContainer}>
              <Text.BodyM style={styles.textDescription} useI18n>
                previewJoinableGroup:description_1
              </Text.BodyM>
              <Text.SubtitleM style={styles.textDescription}>{group?.name}</Text.SubtitleM>
              <Text.BodyM style={styles.textDescription} useI18n>
                previewJoinableGroup:description_2
              </Text.BodyM>
            </Text.BodyM>
          </View>
          <Button.Primary testID="preview_joinable_group.btn_join" style={styles.button} onPress={onPressJoin} useI18n>
            previewJoinableGroup:text_join_group_button
          </Button.Primary>
        </>
      )}
    </ScreenWrapper>
  );
};

const themeStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    title: {
      margin: spacing.margin.large,
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.blue2,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      marginTop: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
    },
    textDescriptionContainer: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
    textDescription: {
      color: colors.blue50,
    },
    button: {
      marginTop: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
    },
    list: {
      paddingRight: 0,
      maxHeight: dimension.deviceHeight < 770 ? dimension.deviceHeight / 3 : dimension.deviceHeight / 2,
    },
    listFooter: {
      marginBottom: 0,
    },
    lastGroupItem: {
      backgroundColor: colors.neutral2,
      paddingVertical: spacing?.padding.small,
    },
  });
};

export default PreviewJoinableGroup;
