import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import useGroups from '~/hooks/groups';
import groupsActions from '~/screens/Groups/redux/actions';
import {ScreenWrapper, Text, Image, Container} from '~/components';
import Icon from '~/beinComponents/Icon';
import {IObject} from '~/interfaces/common';
import {scaleSize} from '~/theme/dimension';
import images from '~/resources/images';
import {IGroupDetail} from '~/interfaces/IGroup';

const GroupDetail = (props: any) => {
  const params = props.route.params;

  const dispatch = useDispatch();
  const theme = useTheme();
  const {spacing}: IObject<any> = theme;
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);

  const groupData = useGroups();
  const {loadingGroupDetail, groupDetail} = groupData;

  const {
    id,
    name,
    userCount,
    parent,
    parentId,
    children,
    icon,
    cover,
    privacy,
    type,
    verified,
    description,
  }: IGroupDetail = groupDetail;

  console.log(
    '\x1b[36m',
    'namanh ---  | GroupDetail params: ',
    params,
    '\x1b[0m',
  );
  console.log(
    '\x1b[36m',
    'namanh ---  | GroupDetail groupDetail : ',
    groupDetail,
    '\x1b[0m',
  );

  useEffect(() => {
    if (params.groupId) {
      dispatch(groupsActions.getGroupDetail(params.groupId));
    }
  }, []);

  const renderInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <View style={{flexDirection: 'row', paddingHorizontal: 12}}>
          <Image style={styles.icon} source={{uri: icon}} />
          <View>
            <View>
              <Text>{name}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon style={styles.iconSmall} icon={'iconPrivate'} size={14} />
              <Text h6>Private Group</Text>
              <Text> ⬩ </Text>
              <Text h6>Company</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.padding.base,
            paddingTop: spacing.padding.small,
          }}>
          <Icon style={styles.iconSmall} icon={'iconPrivate'} size={14} />
          <Text h6>Official</Text>
          <Text> ⬩ </Text>
          <Icon style={styles.iconSmall} icon={'iconUserGroup'} size={16} />
          <Text h6>members</Text>
        </View>
        {!!description && <Text style={styles.textDesc}>{description}</Text>}
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView style={styles.container}>
      <Image
        style={styles.cover}
        source={cover ? {uri: cover} : images.img_cover_default}
      />
      {renderInfo()}
      {loadingGroupDetail && <ActivityIndicator />}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    container: {
      paddingTop: insets.top,
    },
    infoContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
    },
    icon: {
      width: 36,
      height: 36,
      marginRight: spacing.margin.small,
      borderRadius: spacing.borderRadius.small,
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
    },
    textDesc: {
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default GroupDetail;
