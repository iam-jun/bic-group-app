import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IActivityDataImage} from '~/interfaces/IPost';
import UploadingImage from '~/beinComponents/UploadingImage';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Button from '~/beinComponents/Button';

export interface PostPhotoPreviewProps {
  style?: StyleProp<ViewStyle>;
  data: IActivityDataImage[];
  onPress?: () => void;
}

const PostPhotoPreview: FC<PostPhotoPreviewProps> = ({
  style,
  data = [],
  onPress,
}: PostPhotoPreviewProps) => {
  const theme = useTheme() as ITheme;
  const {colors, dimension} = theme;
  const styles = createStyle(theme);

  if (data?.length === 0) {
    return null;
  }
  const imageRatio = (data?.[0]?.width || 1) / (data?.[0]?.height || 1);
  const isVertical = imageRatio <= 0.5;
  const dfSize = Math.min(dimension.deviceWidth, dimension.maxNewsfeedWidth);
  const width = data?.length === 1 ? dfSize : dfSize;
  const height = data?.length === 1 ? dfSize / imageRatio : dfSize;

  const containerStyle: any = {
    flexDirection: isVertical ? 'row' : 'column',
    width,
    height,
  };

  const wrapperStyle: any = {
    width: dfSize,
    alignItems: 'center',
    backgroundColor:
      data?.length === 1 ? colors.borderFocus : colors.background,
  };

  const renderMore = () => {
    return (
      <View style={styles.moreContainer}>
        <Text.H5 color={colors.background}>+ {data.length - 4}</Text.H5>
      </View>
    );
  };

  const renderSmallImage = (
    fileName?: string,
    separate?: boolean,
    isRenderMore?: boolean,
  ) => {
    if (!fileName) {
      return null;
    }
    return (
      <>
        {separate && <ViewSpacing width={4} height={4} />}
        <View style={styles.flex1}>
          <UploadingImage
            style={styles.image}
            uploadType={'postImage'}
            width={'100%'}
            height={'100%'}
            fileName={fileName}
          />
          {isRenderMore && renderMore()}
        </View>
      </>
    );
  };

  return (
    <Button
      disabled={!onPress}
      onPress={onPress}
      style={StyleSheet.flatten([wrapperStyle, style])}>
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <View style={{flex: data?.length === 2 ? 1 : 2}}>
          <UploadingImage
            style={styles.image}
            uploadType={'postImage'}
            width={'100%'}
            height={'100%'}
            fileName={data[0].origin_name}
          />
        </View>
        {data?.length > 1 && (
          <>
            <ViewSpacing width={4} height={4} />
            <View
              style={{flex: 1, flexDirection: isVertical ? 'column' : 'row'}}>
              {renderSmallImage(data?.[1]?.origin_name)}
              {renderSmallImage(data?.[2]?.origin_name, true)}
              {renderSmallImage(data?.[3]?.origin_name, true, data?.length > 4)}
            </View>
          </>
        )}
      </View>
    </Button>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    image: {borderRadius: 0},
    flex1: {flex: 1},
    moreContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(130,128,133,0.64)',
    },
  });
};

export default PostPhotoPreview;
