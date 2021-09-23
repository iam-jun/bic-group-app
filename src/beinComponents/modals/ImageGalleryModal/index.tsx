import React, {FC} from 'react';
import {StyleSheet, Modal, View, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import ImageZoom from 'react-native-image-pan-zoom';

import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageGalleryModalProps} from '~/beinComponents/modals/ImageGalleryModal/IImageGalleryModalProps';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';

const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  visible,
  source,
  onPressClose,
}: ImageGalleryModalProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme, insets);

  const imageUrls = getImageUrls(source);

  const onPressShare = () => {
    alert('share');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Icon
        icon="iconBack"
        onPress={onPressClose}
        size={28}
        tintColor={colors.iconTintReversed}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      />
      <View style={{flex: 1}} />
      <Icon
        icon="ShareAlt"
        onPress={onPressShare}
        size={20}
        tintColor={colors.iconTintReversed}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      />
    </View>
  );

  const renderFooterItem = ({item, index}: any) => {
    return (
      <Button onPress={() => alert('index: ' + index)}>
        <Image
          style={[
            styles.footerItem,
            {
              borderWidth: 1,
              marginLeft: index === 0 ? 20 : 0,
              marginRight:
                index === imageUrls?.length - 1 ? 20 : spacing.margin.tiny,
            },
          ]}
          source={item?.url}
        />
      </Button>
    );
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text.H6 style={styles.textFileName} color={colors.textReversed}>
        FILENAME.JPG
      </Text.H6>
      <FlatList
        horizontal
        data={imageUrls}
        renderItem={renderFooterItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `footer_item_${index}_${item?.url}`}
      />
    </View>
  );

  const renderScreen = (item: any, index: number) => (
    <View key={`${index}`}>
      <Image
        style={styles.screenImage}
        source={{uri: item?.url}}
        resizeMode={'contain'}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        {renderHeader()}
        <View style={{flex: 1}}>
          <PagerView style={{flex: 1}} initialPage={0}>
            {imageUrls.map(renderScreen)}
          </PagerView>
        </View>
        {renderFooter()}
      </View>
    </Modal>
  );
};

const getImageUrls = (source: any) => {
  const result: {url: string; name: string}[] = [];
  if (source?.length > 0) {
    source?.map?.((item: any) => {
      result.push({url: item?.uri || item, name: item?.uri || item});
    });
  } else {
    result.push({url: source?.uri || source, name: source?.uri || source});
  }
  return result;
};

const createStyle = (theme: ITheme, insets: EdgeInsets) => {
  const {spacing, dimension, colors} = theme;
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: 'rgba(82, 79, 85, 0.95)'},
    headerContainer: {
      height: dimension?.headerHeight || 44,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
    },
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: insets?.top,
      right: spacing.margin.large,
      padding: spacing.padding.base,
    },
    textFileName: {
      color: colors.textReversed,
      margin: spacing.margin.base,
    },
    screenImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    footerContainer: {
      backgroundColor: 'rgba(12, 13, 14, 0.5)',
      justifyContent: 'space-between',
      paddingBottom: spacing.padding.extraLarge || 24 + insets.bottom,
    },
    footerItem: {
      width: 48,
      height: 48,
      borderColor: colors.background,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default ImageGalleryModal;
