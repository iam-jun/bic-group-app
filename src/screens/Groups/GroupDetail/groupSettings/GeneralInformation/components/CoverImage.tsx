import {View, ActivityIndicator, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {scaleCoverHeight} from '~/theme/dimension';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';

interface Props {
  testID?: string;
  onEditCover: () => void;
}

const CoverImage = ({testID, onEditCover}: Props) => {
  const [coverHeight, setCoverHeight] = useState<number>(210);
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme, coverHeight);
  const loadingCover = useKeySelector(groupsKeySelector.loadingCover);
  const {background_img_url} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };
  const textColor = !loadingCover ? colors.primary7 : colors.textDisabled;

  return (
    <View testID={testID}>
      <View style={styles.coverHeader}>
        <Text.H5 color={colors.iconTint} useI18n>
          settings:title_cover
        </Text.H5>
        <ButtonWrapper
          testID="cover.button_edit"
          onPress={onEditCover}
          disabled={loadingCover}>
          <Text.H6 testID="cover.text_edit" color={textColor} useI18n>
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <View onLayout={onCoverLayout}>
        {!loadingCover ? (
          <Image
            testID="cover.image"
            style={styles.cover}
            source={background_img_url || images.img_cover_default}
          />
        ) : (
          <View
            testID="cover.loading"
            style={[styles.cover, styles.imageLoading]}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    imageLoading: {
      backgroundColor: colors.bgDisable,
      justifyContent: 'center',
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    basicInfoList: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default CoverImage;
