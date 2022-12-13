import React, {
  ForwardRefRenderFunction, useImperativeHandle, useRef,
} from 'react';
import {
  Platform, ScrollView, Share, StyleSheet,
} from 'react-native';
import i18next from 'i18next';
import { Modalize } from 'react-native-modalize';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomListItem from '~/components/BottomList/BottomListItem';
import spacing from '~/theme/spacing';
import { copyImageFromUrl, downloadImage } from '~/utils/common';

type ImageGalleryMenuProps = {
    photo: any
}

const ImageGalleryMenu: ForwardRefRenderFunction<any, ImageGalleryMenuProps> = ({ photo }, ref) => {
  const modalizeRef = useRef<Modalize>(null);
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const openModal = () => {
    modalizeRef.current?.open();
  };

  const closeModal = () => {
    modalizeRef.current?.close();
  };

  const onPressDownload = () => {
    closeModal();
    downloadImage(photo);
  };

  const onPressCopy = () => {
    closeModal();
    copyImageFromUrl(photo?.url);
  };

  const onPressShare = () => {
    closeModal();
    try {
      Share.share({
        message: photo?.url,
        url: photo?.url,
      }).then((result) => {
        // eslint-disable-next-line no-console
        console.log(
          '\x1b[35m🐣️ Gallery share result: ', result, '\x1b[0m',
        );
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (!photo) return null;

  const defaultData = [
    {
      id: 1,
      testID: 'photomenu.download',
      leftIcon: 'ArrowDownToLine',
      title: i18next.t('common:text_download'),
      onPress: onPressDownload,
    },
    {
      id: 2,
      testID: 'photomenu.copy',
      leftIcon: 'Copy',
      title: i18next.t('common:copy_photo'),
      onPress: onPressCopy,
    },
    {
      id: 3,
      testID: 'photomenu.share',
      leftIcon: 'Share',
      title: i18next.t('common:text_share'),
      onPress: onPressShare,
    },
  ];

  const renderListData = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {
        defaultData.filter((item) => (!(Platform.OS === 'android' && item.id === 2))).map((item: any) => (
          <BottomListItem key={`MenuItem_${item?.title}`} {...item} />))
      }
    </ScrollView>
  );

  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight
      modalStyle={[styles.modalStyle]}
      childrenStyle={[styles.childrenStyle]}
    >
      {renderListData()}
    </Modalize>
  );
};

const createStyles = (insets: EdgeInsets) => StyleSheet.create({
  modalStyle: {
    borderTopRightRadius: spacing.borderRadius.extraLarge,
    borderTopLeftRadius: spacing.borderRadius.extraLarge,
    paddingTop: spacing.padding.extraLarge,
  },
  childrenStyle: {
    paddingBottom: insets.bottom + spacing.padding.large,
  },
});

export default React.forwardRef(ImageGalleryMenu);
