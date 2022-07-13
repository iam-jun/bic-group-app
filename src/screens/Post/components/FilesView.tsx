import {isEmpty, isNumber} from 'lodash';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import UploadingFile, {
  UploadingFileProps,
} from '~/beinComponents/UploadingFile';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import appConfig from '~/configs/appConfig';
import {useBaseHook} from '~/hooks';
import {IActivityDataFile} from '~/interfaces/IPost';
import {IGetFile} from '~/services/fileUploader';

import spacing from '~/theme/spacing';
import {formatBytes} from '~/utils/formatData';

interface Props extends Partial<UploadingFileProps> {
  files: IGetFile[] | IActivityDataFile[];
  remainingSize?: number;
  collapsible?: boolean;
  onRemoveFile?: (item: IGetFile) => void;
}

const FilesView = ({
  files,
  remainingSize,
  collapsible,
  onRemoveFile,
  ...props
}: Props) => {
  if (isEmpty(files)) return null;

  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const {t} = useBaseHook();
  const styles = themeStyles(theme);
  const [collapsed, setCollaped] = useState(true);
  const topData = files.slice(0, 5);

  const bottomData = files.length > 5 ? files.slice(5, files.length - 1) : [];

  const toggleCollapse = () => {
    setCollaped(!collapsed);
  };

  const renderFiles = (data: any[], position: 'top' | 'bottom') => {
    return data.map((item: any, index: number) => (
      <View key={`create-post-file-${position}-${index}`}>
        <UploadingFile
          file={item}
          onClose={() => onRemoveFile?.(item)}
          {...props}
        />
        {index < files.length - 1 && (
          <ViewSpacing height={spacing.margin.small} />
        )}
      </View>
    ));
  };

  const data = collapsible ? topData : files;

  return (
    <View style={{flex: 1}}>
      {renderFiles(data, 'top')}
      {collapsible && files.length > 5 && (
        <View style={{}}>
          <Collapsible collapsed={collapsed}>
            {renderFiles(bottomData, 'bottom')}
          </Collapsible>

          <ButtonWrapper onPress={toggleCollapse}>
            <Text.Subtitle style={styles.collapsibleText}>
              {t(`common:${collapsed ? 'text_show_all' : 'text_show_less'}`)}
            </Text.Subtitle>
          </ButtonWrapper>
        </View>
      )}

      {isNumber(remainingSize) && (
        <Text.Subtitle style={styles.remainingText}>
          {t('upload:text_file_remainning', {
            max_files: appConfig.maxFiles,
            remaining_size: formatBytes(remainingSize),
          })}
        </Text.Subtitle>
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    remainingText: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
      color: colors.gray50,
    },
    collapsibleText: {
      marginVertical: spacing.margin.small,
      color: colors.gray50,
    },
  });
};

export default FilesView;
