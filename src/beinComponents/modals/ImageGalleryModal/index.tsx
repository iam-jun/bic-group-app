import React, {FC, useState, useRef} from 'react';
import {
  StyleSheet,
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import ImageZoom from 'react-native-image-pan-zoom';
import {debounce} from 'lodash';

import Icon from '~/beinComponents/Icon';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageGalleryModalProps} from '~/beinComponents/modals/ImageGalleryModal/IImageGalleryModalProps';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  visible,
  source,
  onPressClose,
  initIndex = 0,
  alwaysShowFileName,
}: ImageGalleryModalProps) => {
  const [activeIndex, _setActiveIndex] = useState(initIndex);
  const [isFocus, setIsFocus] = useState(false);

  const pagerRef = useRef<any>();
  const footerListRef = useRef<any>();

  const insets = useSafeAreaInsets();
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme, insets);

  const imageUrls = getImageUrls(source);

  const onRequestClose = () => {
    if (isFocus) {
      setIsFocus(false);
    } else {
      onPressClose?.();
    }
  };

  const onPressShare = () => {
    try {
      Share.share({
        message: imageUrls?.[activeIndex]?.url,
        url: imageUrls?.[activeIndex]?.url,
      }).then(result => {
        console.log(`\x1b[35m🐣️ Gallery share result: `, result, `\x1b[0m`);
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const setActiveIndex = debounce(
    (index: number) => {
      if (index !== activeIndex) {
        _setActiveIndex(index);
        pagerRef?.current?.setPage?.(index);
        footerListRef?.current?.scrollToIndex({
          index: index,
          viewPosition: 0.5,
        });
      }
    },
    Platform.OS === 'ios' ? 300 : 50,
  );

  const onPageSelected = (e: any) => {
    const newIndex = e?.nativeEvent?.position || 0;
    setActiveIndex(newIndex);
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

  const getItemFooterLayout = (data: any, index: number) => ({
    length: 48,
    offset: 48 * index,
    index,
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Icon
        icon="iconBack"
        onPress={onPressClose}
        size={28}
        tintColor={colors.neutral80Reversed}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      />
      <View style={{flex: 1}} />
      <Icon
        icon="ShareNodes"
        onPress={onPressShare}
        size={20}
        tintColor={colors.neutral80Reversed}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      />
    </View>
  );

  const renderFooterItem = ({item, index}: any) => {
    return (
      <Button onPress={() => setActiveIndex(index)}>
        <Image
          style={[
            styles.footerItem,
            {
              borderWidth: index === activeIndex ? 1 : 0,
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
            <Text.H6 color={colors.white} numberOfLines={1}>
              {fileName}
            </Text.H6>
          )}
        </View>
        <FlatList
          ref={footerListRef}
          horizontal
          data={imageUrls}
          initialScrollIndex={initIndex}
          getItemLayout={getItemFooterLayout}
          renderItem={renderFooterItem}
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={onScrollToIndexFailed}
          keyExtractor={(item, index) => `footer_item_${index}_${item?.url}`}
        />
      </View>
    );
  };

  const renderScreen = (item: any, index: number) => (
    <TouchableOpacity
      key={`${index}`}
      activeOpacity={0.8}
      onPress={() => setIsFocus(true)}>
      <Image
        style={styles.screenImage}
        source={{uri: item?.url}}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );

  const renderControlButton = () => {
    return (
      <View style={styles.buttonControlContainer}>
        <View>
          {activeIndex > 0 && (
            <Button style={styles.buttonControl} onPress={onPressBack}>
              <Icon icon={'iconBack'} tintColor={colors.white} />
            </Button>
          )}
        </View>
        <View>
          {activeIndex < imageUrls.length - 1 && (
            <Button style={styles.buttonControl} onPress={onPressNext}>
              <Icon icon={'AngleRightSolid'} tintColor={colors.white} />
            </Button>
          )}
        </View>
      </View>
    );
  };

  const renderFocusScreen = () => {
    return (
      <View style={styles.focusScreenContainer}>
        <ImageZoom
          cropWidth={dimension.deviceWidth}
          cropHeight={dimension.deviceHeight}
          imageWidth={dimension.deviceWidth}
          imageHeight={dimension.deviceHeight}
          onClick={() => setIsFocus(false)}>
          <Image
            resizeMode={'contain'}
            style={{
              width: dimension.deviceWidth,
              height: dimension.deviceHeight,
              resizeMode: 'contain',
            }}
            source={{uri: imageUrls?.[activeIndex]?.url}}
          />
        </ImageZoom>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onRequestClose}>
      {visible && (
        <View style={styles.container}>
          {renderHeader()}
          <View style={{flex: 1, flexDirection: 'row'}}>
            <PagerView
              ref={pagerRef}
              style={{flex: 1}}
              initialPage={initIndex}
              onPageSelected={onPageSelected}>
              {imageUrls.map(renderScreen)}
            </PagerView>
            {renderControlButton()}
          </View>
          {renderFooter()}
          {isFocus && renderFocusScreen()}
        </View>
      )}
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

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(82, 79, 85, 0.95)',
      paddingTop: Platform.OS === 'android' ? 0 : insets.top,
    },
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
    fileNameContainer: {
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
      borderColor: colors.white,
      borderRadius: spacing.borderRadius.small,
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
      width: 32,
      height: 32,
      borderRadius: 16,
      margin: spacing.margin.tiny,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(41, 39, 42, 0.2)',
    },
    focusScreenContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.gray40,
    },
  });
};

export default ImageGalleryModal;
