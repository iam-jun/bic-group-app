import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import ScreenWrapper from '~/components/ScreenWrapper';
import NavigationHeader from '~/components/headers/NavigationHeader';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import HorizontalView from '~/components/layout/HorizontalView';
import {margin, padding} from '~/theme/spacing';
import ListView from '~/components/list/ListView';
import createPostToolbar from '~/constants/createPostToolbar';
import {useBaseHook} from '~/hooks';
import {Text} from '~/components';
import {IObject} from '~/interfaces/common';
import Divider from '~/components/Divider';

const CreatePostView = ({navigation}: {navigation: any}) => {
  const {t} = useBaseHook();
  const [text, setText] = useState<string>('');
  const theme: IObject<any> = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScreenWrapper isFullView testID="CreatePostScreen">
        <NavigationHeader
          isFullView
          isDefault
          title={t('post:create_post')}
          rightComponent={
            <PrimaryButton
              contentStyle={styles.button}
              disabled={!!text ? false : true}
              testID="CreatePost"
              title={t('post:post_button')}
              onPress={() => {
                console.log('Post');
              }}
            />
          }
        />
        <HorizontalView>
          <Text style={styles.sendTo} bold>
            {t('post:send_to')}
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              styles.chooseAudience,
              {backgroundColor: theme.colors.tag},
            ]}>
            <Text primary={{color: theme.colors.purple}}>
              {t('post:choose_group_people')}
            </Text>
          </TouchableOpacity>
        </HorizontalView>

        <ScrollView>
          <TextInput
            placeholder={t('post:placeholder_write_post')}
            value={text}
            onChangeText={text => setText(text)}
            multiline
            autoFocus={true}
            style={styles.textContent}
          />
        </ScrollView>
        <View style={styles.actionList}>
          <Divider thick={1} />
          <ListView data={createPostToolbar} type="option" />
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default CreatePostView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
  },
  sendTo: {
    marginHorizontal: margin.big,
    marginVertical: margin.base,
  },
  chooseAudience: {
    marginHorizontal: margin.small,
    marginVertical: margin.base,
    borderRadius: 50,
    paddingHorizontal: padding.base,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    minHeight: 500,
    marginVertical: margin.base,
    marginHorizontal: margin.big,
  },
  button: {
    height: 35,
  },
  actionList: {
    justifyContent: 'flex-end',
    marginVertical: margin.big,
  },
});
