import React, {useState} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import NavigationHeader from '~/components/headers/NavigationHeader';
import {useBaseHook} from '~/hooks';
import Input from '~/components/inputs';
import {spacing} from '~/theme';
import {IObject} from '~/interfaces/common';
import Text from '~/components/texts/Text';
import {generateRandomUser} from '~/utils/generator';
import ListView from '~/beinComponents/list/ListView';
import {ScrollView} from 'react-native-gesture-handler';
import HorizontalView from '~/components/layout/HorizontalView';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import useAudience from '~/hooks/audience';
import commonActions from '~/constants/commonActions';
import audienceActions from './redux/actions';
import {IUser} from '~/interfaces/IAuth';
import mainStack from '~/router/navigator/MainStack/stack';

const SelectPostAudienceScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();
  const {audiences} = useAudience();
  const [selectedAudience, setSelectedAudience] = useState<{user: IUser}[]>(
    audiences.data,
  );

  const dataGroup = Array.from(Array(4).keys()).map(index => ({
    user: generateRandomUser(),
  }));

  const dataPeople = Array.from(Array(8).keys()).map(index => ({
    user: generateRandomUser(),
  }));

  const {t} = useBaseHook();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  const removeSelectedAudience = (item: {user: IUser}) => {
    const newData = [...selectedAudience];
    const removeIndex = selectedAudience.findIndex(
      (el: {user: IUser}) => el.user.id === item.user.id,
    );
    if (removeIndex >= 0) {
      newData.splice(removeIndex, 1);
    }
    setSelectedAudience(newData);
  };

  const _onActionPress = (action: string, item: {user: IUser}) => {
    switch (action) {
      case commonActions.checkBox: {
        setSelectedAudience([...selectedAudience, item]);
        break;
      }

      case commonActions.removeTag:
      case commonActions.uncheckBox:
        return removeSelectedAudience(item);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScreenWrapper isFullView testID="CreatePostScreen">
        <NavigationHeader
          isFullView
          isDefault
          title={t('post:select_audience')}
          rightComponent={
            <PrimaryButton
              testID="btnSave"
              contentStyle={{height: 35}}
              title={t('common:text_save')}
              onPress={() => {
                dispatch(audienceActions.setAudiences(selectedAudience));
                navigation.navigate(mainStack.createPost);
              }}
            />
          }
        />

        <View>
          <Input
            style={styles.inputSearch}
            roundness="big"
            helperType="info"
            placeholder={t('post:placeholder_audience_search')}
            left={<TextInput.Icon name={'magnify'} />}
          />
        </View>
        <ScrollView>
          {/* selected audience list */}
          {selectedAudience.length !== 0 && (
            <View style={styles.textTitle}>
              <Text style={styles.textTag} bold>
                {t('post:audience_selected')}
              </Text>
              <ListView
                contentContainerStyle={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}
                style={styles.listView}
                type="tag"
                data={selectedAudience}
                onActionPress={_onActionPress}
              />
            </View>
          )}

          {/* groups list */}
          <View style={styles.textTitle}>
            <HorizontalView style={{justifyContent: 'space-between'}}>
              <Text style={styles.textTag} bold>
                {t('post:group_manage')}
              </Text>
              <Text style={styles.showAll}>{t('post:show_all')}</Text>
            </HorizontalView>

            <ListView
              style={styles.listView}
              type="people"
              data={dataGroup}
              onActionPress={_onActionPress}
            />
          </View>

          {/* people list */}
          <View style={styles.textTitle}>
            <HorizontalView style={{justifyContent: 'space-between'}}>
              <Text style={styles.textTag} bold>
                {t('post:people_search')}
              </Text>
              <Text style={styles.showAll}>{t('post:show_all')}</Text>
            </HorizontalView>

            <ListView
              style={styles.listView}
              type="people"
              data={dataPeople}
              onActionPress={_onActionPress}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default SelectPostAudienceScreen;

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    inputSearch: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
    },
    textTitle: {
      marginHorizontal: spacing.margin.large,
    },
    listView: {
      marginBottom: spacing.margin.large,
    },
    textTag: {
      marginVertical: spacing.margin.base,
      fontSize: 16,
    },
    showAll: {
      fontSize: 12,
      marginVertical: spacing.margin.base,
    },
    saveButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: spacing.margin.large,
    },
  });
};
