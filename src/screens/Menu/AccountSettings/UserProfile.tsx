import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import * as modalActions from '~/store/modal/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import AlertModal from '~/beinComponents/modals/AlertModal';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import dataBasicInfo from './basicInfoFields';

const UserProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const renderItem = ({item}: {item: any}) => {
    return (
      <PrimaryItem
        title={t(item.title)}
        subTitle={item.subtitle}
        LeftComponent={
          <Icon
            style={{marginRight: theme.spacing.margin.extraLarge}}
            icon={item.leftIcon}
            tintColor={theme.colors.primary7}
          />
        }
        RightComponent={
          <>
            <ButtonWrapper onPress={popupMessage}>
              <Icon icon={item.privacyIcon} />
            </ButtonWrapper>
            <ButtonWrapper onPress={popupMessage}>
              <Icon
                icon={'EditAlt'}
                style={{marginLeft: theme.spacing.margin.extraLarge}}
              />
            </ButtonWrapper>
          </>
        }
      />
    );
  };

  const popupMessage = () =>
    dispatch(
      modalActions.showAlert({
        title: 'Info',
        content:
          'Function has not been developed. Stay tuned for further releases 😀',
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: 'Got it',
      }),
    );

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header title={t('settings:title_about')} />

      {/* --- AVATAR --- */}
      <View style={styles.avatarHeader}>
        <Text.H5 color={theme.colors.iconTint}>Avatar</Text.H5>
        <ButtonWrapper onPress={popupMessage}>
          <Text.H6 color={theme.colors.primary7}>Edit</Text.H6>
        </ButtonWrapper>
      </View>
      <ButtonWrapper onPress={popupMessage} style={{alignItems: 'center'}}>
        <Avatar.UltraLarge
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          badge={'Edit'}
          badgeBottom
        />
      </ButtonWrapper>
      <Divider style={{marginVertical: theme.spacing.margin.small}} />

      {/* --- COVER --- */}
      <View style={styles.coverHeader}>
        <Text.H5 color={theme.colors.iconTint}>Cover</Text.H5>
        <ButtonWrapper onPress={popupMessage}>
          <Text.H6 color={theme.colors.primary7}>Edit</Text.H6>
        </ButtonWrapper>
      </View>
      <ButtonWrapper onPress={popupMessage}>
        <Image
          style={styles.cover}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
        />
      </ButtonWrapper>
      <Divider style={{marginVertical: theme.spacing.margin.small}} />

      {/* --- BASIC INFO --- */}
      <View style={styles.infoHeader}>
        <Text.H5 color={theme.colors.iconTint}>Basic Info</Text.H5>
      </View>
      <ListView
        scrollEnabled={false}
        type="primary"
        data={dataBasicInfo}
        renderItem={renderItem}
        listStyle={styles.basicInfoList}
      />

      <AlertModal />
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {},
    list: {
      marginTop: spacing.margin.base,
    },
    avatarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    infoHeader: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
    },
    basicInfoList: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};
