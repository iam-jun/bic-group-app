import React from 'react';
import {useDispatch} from 'react-redux';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {rightColMenu} from '~/constants/rightCol';
import images from '~/resources/images';
import Text from '~/beinComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useBaseHook} from '~/hooks';
import * as modalActions from '~/store/modal/actions';
import {IRightMenu} from '~/interfaces/common';
import spacing from '~/theme/spacing';

const RightCol = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const onItemPress = (item: IRightMenu) => {
    switch (item.type) {
      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  return (
    <ScreenWrapper testID="RightCol" style={styles.container} isFullView>
      <Image
        resizeMode="contain"
        style={styles.img}
        source={images.img_right_col}
      />
      <View style={styles.mainContainer}>
        {rightColMenu.map((item, index) => {
          // only render even item, and odd item on the same row
          if (index % 2 !== 0) return null;
          const nextItem = rightColMenu[index + 1] || undefined;

          return (
            <View key={index} style={styles.menuRow}>
              {item && (
                <TouchableOpacity
                  style={styles.menuItemLeft}
                  onPress={() => onItemPress(item)}>
                  <Text.Body style={styles.menuText}>{t(item.title)}</Text.Body>
                </TouchableOpacity>
              )}
              {nextItem && (
                <TouchableOpacity
                  style={styles.menuItemRight}
                  onPress={() => onItemPress(nextItem)}>
                  <Text.Body style={styles.menuText}>
                    {t(nextItem.title)}
                  </Text.Body>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={images.logo_bein}
          />
        </View>
        <Text.BodyM style={styles.footerText}>
          {t('right_col:bein_2021')}
        </Text.BodyM>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  const menuItemMinWidth = '15%';

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.margin.large,
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.surface,
    },
    img: {
      width: '100%',
      height: 250,
    },
    mainContainer: {
      marginVertical: spacing.margin.large,
      padding: spacing.padding.small,
      borderColor: colors.borderDivider,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    menuRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.margin.tiny,
    },
    menuItemLeft: {
      textAlign: 'right',
      minWidth: menuItemMinWidth,
      marginHorizontal: spacing.margin.small,
    },
    menuItemRight: {
      textAlign: 'left',
      minWidth: menuItemMinWidth,
      marginHorizontal: spacing.margin.small,
    },
    menuText: {
      color: colors.textSecondary,
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      marginRight: spacing.margin.base,
      overflow: 'visible',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.0875,
      shadowRadius: 24,

      elevation: 20,
    },
    logo: {
      width: 24,
      height: 24,
    },
    footerText: {
      paddingTop: 0,
    },
  });
};

export default RightCol;
