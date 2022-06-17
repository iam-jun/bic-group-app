import i18next from 'i18next';
import React, {useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {uploadTypes} from '~/configs/resourceConfig';
import privacyTypes, {groupPrivacy} from '~/constants/privacyTypes';
import {useKeySelector} from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import AvatarImage from './components/AvatarImage';
import PrivacyItem from './components/PrivacyItem';
import CoverImage from './components/CoverImage';
import GroupInfoView from './components/GroupInfoView';
import {alertAction, _openImagePicker} from './helper';

const GeneralInformation = (props: any) => {
  const params = props.route.params;
  const {groupId: id} = params || {};

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {privacy} = useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const {total} = useKeySelector(groupsKeySelector.pendingMemberRequests);

  const baseSheetRef: any = useRef();

  useEffect(() => {
    dispatch(groupsActions.getGroupDetail(id));
  }, [id]);

  const helpMessage = () => {
    baseSheetRef.current?.close();
    dispatch(
      modalActions.showAlert({
        title: i18next.t('settings:text_info'),
        content: i18next.t('settings:text_help_center'),
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: i18next.t('settings:text_got_it'),
      }),
    );
  };

  const openGroupPrivacyModal = (e: any) =>
    baseSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  const editGroupPrivacy = (item: any) => {
    dispatch(
      groupsActions.editGroupDetail({
        data: {id, privacy: item.type},
        editFieldName: i18next.t('common:text_privacy'),
      }),
    );
  };

  const approveAllGroupMemberRequests = () => {
    dispatch(groupsActions.approveAllGroupMemberRequests({groupId: id}));
    editGroupPrivacy({type: groupPrivacy.public});
  };

  const declineAllGroupMemberRequests = () => {
    dispatch(groupsActions.declineAllGroupMemberRequests({groupId: id}));
    editGroupPrivacy({type: groupPrivacy.secret});
  };

  const onPrivacyMenuPress = (item: any) => {
    baseSheetRef.current?.close();

    if (privacy === groupPrivacy.private && total > 0) {
      if (item.type === groupPrivacy.public) {
        alertAction(
          dispatch,
          theme,
          i18next.t('groups:update_privacy_modal:title'),
          i18next.t('groups:update_privacy_modal:content:approve'),
          approveAllGroupMemberRequests,
        );
      }

      if (item.type === groupPrivacy.secret) {
        alertAction(
          dispatch,
          theme,
          i18next.t('groups:update_privacy_modal:title'),
          i18next.t('groups:update_privacy_modal:content:decline'),
          declineAllGroupMemberRequests,
        );
      }
    } else {
      editGroupPrivacy(item);
    }
  };

  const onEditAvatar = () =>
    _openImagePicker(dispatch, id, 'icon', uploadTypes.groupAvatar);

  const onEditCover = () =>
    _openImagePicker(
      dispatch,
      id,
      'background_img_url',
      uploadTypes.groupCover,
    );

  const renderPrivacyItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        testID={`general_information.privacy_item.${item.type}`}
        onPress={() => onPrivacyMenuPress(item)}>
        <PrivacyItem item={item} onPressHelpMessage={helpMessage} />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      testID="general_information"
      style={styles.container}
      isFullView>
      <Header title={i18next.t('settings:title_general_information')} />
      <ScrollView>
        <AvatarImage
          testID="general_information.avatar"
          onEditAvatar={onEditAvatar}
        />
        <CoverImage
          testID="general_information.cover"
          onEditCover={onEditCover}
        />
        <GroupInfoView id={id} onPressPrivacy={openGroupPrivacyModal} />
        <BottomSheet
          modalizeRef={baseSheetRef}
          ContentComponent={
            <View style={styles.contentBottomSheet}>
              <Text.H5
                color={colors.iconTint}
                style={styles.privacyTypeText}
                useI18n>
                settings:title_privacy_type
              </Text.H5>
              <ListView data={privacyTypes} renderItem={renderPrivacyItem} />
            </View>
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default GeneralInformation;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentBottomSheet: {
      marginHorizontal: spacing.margin.base,
      marginTop: spacing.margin.large,
    },
    privacyTypeText: {
      marginLeft: spacing.margin.base,
      marginBottom: spacing.margin.small,
      fontSize: 18,
    },
  });
};
