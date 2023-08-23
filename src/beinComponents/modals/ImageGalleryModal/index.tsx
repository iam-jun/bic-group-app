/* eslint-disable no-console */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useRef } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import { debounce } from 'lodash';

import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Icon from '~/baseComponents/Icon';
import { ImageGalleryModalProps } from '~/beinComponents/modals/ImageGalleryModal/IImageGalleryModalProps';
import Image from '~/components/Image';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import ImageGalleryMenu from './ImageGalleryMenu';
import AlertModal from '../AlertModal';
import Toast from '~/baseComponents/Toast';
import ImageZoomable from '~/components/Image/ImageZoomable';

const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  visible,
  source,
  onPressClose,
  initIndex = 0,
  alwaysShowFileName,
  isShowImgName = true,
}: ImageGalleryModalProps) => {
  const [activeIndex, _setActiveIndex] = useState(initIndex);

  const pagerRef = useRef<any>();
  const footerListRef = useRef<any>();
  const modalizeRef = useRef<any>(null);

  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme, insets);

  const imageUrls = getImageUrls(source);

  const onRequestClose = () => {
    onPressClose?.();
  };

  const onPressMenu = () => {
    modalizeRef.current?.openModal?.();
  };

  const setActiveIndex = debounce(
    (index: number) => {
      if (index !== activeIndex) {
        _setActiveIndex(index);
        pagerRef?.current?.setPage?.(index);
        footerListRef?.current?.scrollToIndex({
          index,
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
    console.warn('\x1b[31m🐣️ ImageGalleryModal onScrollToIndexFailed\x1b[0m');
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
        tintColor={colors.white}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
      />
      <View style={{ flex: 1 }} />
      <Icon
        icon="Ellipsis"
        onPress={onPressMenu}
        size={20}
        tintColor={colors.white}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
      />
    </View>
  );

  const renderFooterItem = ({ item, index }: any) => (
    <Button onPress={() => setActiveIndex(index)}>
      <Image
        style={[
          styles.footerItem,
          {
            borderWidth: index === activeIndex ? 1 : 0,
            marginLeft: index === 0 ? 20 : 0,
            marginRight:
              index === (imageUrls?.length || 0) - 1 ? 20 : spacing.margin.tiny,
          },
        ]}
        source={item?.url}
      />
    </Button>
  );

  // eslint-disable-next-line arrow-body-style
  const renderFooter = () => {
    // let fileName = imageUrls?.[activeIndex]?.name?.toUpperCase?.();
    // if (!fileName && alwaysShowFileName) {
    //   fileName = imageUrls?.[activeIndex]?.url
    //     ?.replace?.(/(.+)\/(.+)$/, '$2')
    //     ?.toUpperCase?.();
    // }

    return (
      <View style={styles.footerContainer}>
        <View style={styles.fileNameContainer}>
          {/* {(!!fileName && isShowImgName) && (
            <Text.H6 color={colors.white} numberOfLines={1}>
              {fileName}
            </Text.H6>
          )} */}
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

  const onSwipe = (isFromRightToLeft: boolean) => {
    if (isFromRightToLeft) {
      onPressNext();
    } else {
      onPressBack();
    }
  };

  const renderScreen = (item: any, index: number) => (
    <View key={`${index}`} style={{ flex: 1 }}>
      <ImageZoomable
        imageProps={{ source: { uri: item?.url } }}
        onSwipe={onSwipe}
        onLongPressTap={onPressMenu}
      />
    </View>
  );

  const renderControlButton = () => (
    <View pointerEvents="box-none" style={styles.buttonControlContainer}>
      <View>
        {activeIndex > 0 && (
          <Button style={styles.buttonControl} onPress={onPressBack}>
            <Icon icon="iconBack" tintColor={colors.white} />
          </Button>
        )}
      </View>
      <View>
        {activeIndex < imageUrls.length - 1 && (
          <Button style={styles.buttonControl} onPress={onPressNext}>
            <Icon icon="AngleRightSolid" tintColor={colors.white} />
          </Button>
        )}
      </View>
    </View>
  );

  return (
    <Modal testID="image_gallery_modal" visible={visible} transparent onRequestClose={onRequestClose}>
      {visible && (
      <View style={styles.container}>
        {renderHeader()}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={initIndex}
            onPageSelected={onPageSelected}
                // for unit test
            layoutDirection="ltr"
            scrollEnabled={false}
          >
            {imageUrls.map(renderScreen)}
          </PagerView>
          {renderControlButton()}
        </View>
        {renderFooter()}
        <ImageGalleryMenu
          photo={imageUrls[activeIndex]}
          ref={modalizeRef}
        />
        <AlertModal />
        <Toast />
      </View>
      )}
    </Modal>
  );
};

const getImageUrls = (source: any) => {
  const result: { url: string; id: string }[] = [];
  if (source?.length > 0) {
    source?.forEach?.((item: any) => {
      result.push({ url: item?.uri || item, id: item?.id });
    });
  } else {
    result.push({ url: source?.uri || source, id: source?.id });
  }
  return result;
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
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
