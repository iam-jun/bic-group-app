import React, {FC, useState, useRef} from 'react';
import {StyleSheet, Modal, View, FlatList, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';

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
  initIndex = 0,
  alwaysShowFileName,
}: ImageGalleryModalProps) => {
  const [activeIndex, _setActiveIndex] = useState(initIndex);
  const [zoomIn, setZoomIn] = useState(false);

  const footerListRef = useRef<any>();

  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const {colors, spacing, dimension} = theme;
  const styles = createStyle(theme, insets);

  const imageUrls = getImageUrls(source);

  const onPressShare = () => {
    alert('share');
  };

  const setActiveIndex = (index: number) => {
    if (index !== activeIndex) {
      _setActiveIndex(index);
      footerListRef?.current?.scrollToIndex({index: index, viewPosition: 0.5});
    }
  };

  const onScrollToIndexFailed = () => {
    console.log(`\x1b[31m🐣️ ImageGalleryModal onScrollToIndexFailed\x1b[0m`);
  };

  const onPressNext = () => {
    if (activeIndex < imageUrls.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const onPressBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{flex: 1}} />
      <Button style={styles.buttonControlHeader} onPress={onPressShare}>
        <Icon icon={'ShareAlt'} tintColor={colors.iconTintReversed} />
      </Button>
      <Button style={styles.buttonControlHeader} onPress={onPressClose}>
        <Icon icon={'iconClose'} tintColor={colors.iconTintReversed} />
      </Button>
    </View>
  );

  const renderFooterItem = ({item, index}: any) => {
    return (
      <Button onPress={() => setActiveIndex(index)}>
        <View
          style={{
            width: 48,
            height: 48,
            borderColor: colors.background,
            borderRadius: spacing.borderRadius.small,
            borderWidth: index === activeIndex ? 1 : 0,
            overflow: 'hidden',
            marginLeft: index === 0 ? 20 : 0,
            marginRight:
              index === imageUrls?.length - 1 ? 20 : spacing.margin.tiny,
          }}>
          <Image style={styles.footerItem} source={item?.url} />
        </View>
      </Button>
    );
  };

  const renderFooter = () => {
    let fileName = imageUrls?.[activeIndex]?.name?.toUpperCase?.();
    if (!fileName && alwaysShowFileName) {
      fileName = imageUrls?.[activeIndex]?.url
        ?.replace?.(/(.+)\/(.+)$/, '$2')
        ?.toUpperCase?.();
    }

    return (
      <View style={styles.footerContainer}>
        <View style={styles.fileNameContainer}>
          {!!fileName && (
            <Text.H6 color={colors.textReversed} numberOfLines={1}>
              {fileName}
            </Text.H6>
          )}
        </View>
        <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          ref={footerListRef}
          horizontal
          data={imageUrls}
          renderItem={renderFooterItem}
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={onScrollToIndexFailed}
          keyExtractor={(item, index) => `footer_item_${index}_${item?.url}`}
        />
      </View>
    );
  };

  const renderControlButton = () => {
    return (
      <View style={styles.buttonControlContainer}>
        <View>
          {activeIndex > 0 && (
            <Button style={styles.buttonControl} onPress={onPressBack}>
              <Icon icon={'iconBack'} tintColor={colors.iconTintReversed} />
            </Button>
          )}
        </View>
        <View>
          {activeIndex < imageUrls.length - 1 && (
            <Button style={styles.buttonControl} onPress={onPressNext}>
              <Icon icon={'iconNext'} tintColor={colors.iconTintReversed} />
            </Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.imageContainer}>
          <Pressable onPress={() => setZoomIn(!zoomIn)}>
            <Image
              source={imageUrls?.[activeIndex]?.url}
              className={zoomIn ? 'image-zoom-out' : 'image-zoom-in'}
            />
          </Pressable>
          {renderControlButton()}
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
      result.push({url: item?.uri || item, name: item?.name});
    });
  } else {
    result.push({url: source?.uri || source, name: source?.name});
  }
  return result;
};

const createStyle = (theme: ITheme, insets: EdgeInsets) => {
  const {spacing, dimension, colors} = theme;
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: 'rgba(12, 13, 14, 0.8)'},
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.padding.extraLarge,
      paddingRight: spacing.padding.extraLarge,
    },
    imageContainer: {
      width: '100%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: insets?.top,
      right: spacing.margin.large,
      padding: spacing.padding.base,
    },
    fileNameContainer: {
      margin: spacing.margin.base,
    },
    screenImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    footerContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: spacing.padding.extraLarge || 24 + insets.bottom,
    },
    footerItem: {
      width: 48,
      height: 48,
    },
    buttonControlContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonControl: {
      width: 44,
      height: 44,
      borderRadius: 22,
      margin: spacing.margin.extraLarge,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(41, 39, 42, 0.2)',
    },
    buttonControlHeader: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginLeft: spacing.margin.base,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.textSecondary,
    },
    focusScreenContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.borderFocus,
    },
  });
};

export default ImageGalleryModal;
