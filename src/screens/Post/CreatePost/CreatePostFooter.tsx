import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import MentionBar from '~/beinComponents/inputs/_MentionInput/MentionBar';
import Div from '~/beinComponents/Div';

export interface CreatePostFooterProps {
  toolbarModalizeRef?: any;
  loading?: boolean;
}

const CreatePostFooter: FC<CreatePostFooterProps> = ({
  toolbarModalizeRef,
  loading,
}: CreatePostFooterProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  return (
    <Div className="post-toolbar-container">
      <PostToolbar modalizeRef={toolbarModalizeRef} disabled={loading} />
      <MentionBar style={{borderColor: colors.borderDivider}} />
    </Div>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({});
};

export default CreatePostFooter;
