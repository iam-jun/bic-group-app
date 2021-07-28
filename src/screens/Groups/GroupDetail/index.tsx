import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import useGroups from '~/hooks/groups';
import groupsActions from '~/screens/Groups/redux/actions';
import {Image, ViewSpacing} from '~/components';
import Icon from '~/beinComponents/Icon';
import {scaleSize} from '~/theme/dimension';
import images from '~/resources/images';
import ListView from '~/beinComponents/list/ListView';
import {data} from '~/screens/Home/Newsfeed/dummy-data';
import PostItem from '~/beinComponents/list/items/PostItem';
import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';

const GroupDetail = (props: any) => {
  const params = props.route.params;

  const dispatch = useDispatch();
  const theme: ITheme = useTheme();
  const styles = themeStyles(theme);

  const groupData = useGroups();
  const {loadingGroupDetail} = groupData;

  useEffect(() => {
    if (params?.id) {
      dispatch(groupsActions.getGroupDetail(params.id));
    }
  }, []);

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const renderInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Avatar.UltraLarge source={params.icon} style={styles.avatar} />
          <View style={{flex: 1}}>
            <ButtonWrapper
              textProps={{
                variant: 'h5',
              }}>
              {params.name}
            </ButtonWrapper>

            <View style={{flexDirection: 'row'}}>
              <Icon style={styles.iconSmall} icon={'iconPrivate'} size={12} />
              <Text.Subtitle useI18n>Private Group</Text.Subtitle>
              <Text.Subtitle> ⬩ </Text.Subtitle>
              <Icon style={styles.iconSmall} icon={'iconUserGroup'} size={14} />
              <Text.Subtitle>{`${params.userCount} members`}</Text.Subtitle>
            </View>
          </View>
        </View>
        {!!params.description && (
          <Text style={styles.textDesc}>{params.description}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <ListView
        isFullView
        style={styles.listViewStyle}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View
            style={{
              backgroundColor: theme.colors.background,
              marginBottom: 16,
            }}>
            <Image
              style={styles.cover}
              source={
                params.cover ? {uri: params.cover} : images.img_cover_default
              }
            />
            {renderInfo()}
            {loadingGroupDetail && <ActivityIndicator />}
          </View>
        )}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing?.margin.base} />
        )}
      />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
    listViewStyle: {
      backgroundColor: theme.colors.bgDisable,
    },
    infoContainer: {
      paddingHorizontal: spacing?.padding.large,
      paddingVertical: spacing?.padding.base,
      borderBottomWidth: 1,
      borderColor: colors.borderCard,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginLeft: spacing?.margin.large,
      marginRight: spacing?.margin.base,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
    },
    iconSmall: {
      marginRight: spacing?.margin.tiny,
    },
    textDesc: {
      paddingHorizontal: spacing?.padding.base,
      paddingVertical: spacing?.padding.base,
    },
  });
};

export default GroupDetail;
