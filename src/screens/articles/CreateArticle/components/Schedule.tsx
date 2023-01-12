import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import modalActions from '~/storeRedux/modal/actions';
import { spacing } from '~/theme';
import useCreateArticle from '../hooks/useCreateArticle';
import useCreateArticleStore from '../store';
import ScheduleModal from './ScheduleModal';

type ScheduleProps = {
  articleId: string;
};

const Schedule: FC<ScheduleProps> = ({ articleId }) => {
  const styles = createStyle();
  const dispatch = useDispatch();

  const actions = useCreateArticleStore((state) => state.actions);
  const {
    isValidating, validButtonPublish, validateSeriesTags, handleSave, resetPublishedAt,
  }
    = useCreateArticle({ articleId });

  const disabled = !validButtonPublish || isValidating;

  const validateData = () => {
    const doAfterResolveError = () => {
      // after resolve invalid Series Tags, need to save article
      handleSave({
        isNavigateBack: false,
        isShowToast: false,
        onSuccess: onValidateSuccess,
      });
    };
    const onError = (error) => {
      actions.handleSaveError(error, doAfterResolveError);
    };
    validateSeriesTags(onValidateSuccess, onError);
  };

  const handleOpenPopupSchedule = () => {
    validateData();
  };

  const showModal = (ContentComponent: any, props: any = {}) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent,
        props,
      }),
    );
  };

  const onClose = () => {
    dispatch(modalActions.hideModal());
    actions.setErrorScheduleSubmiting('');
    actions.setIsScheduleSubmitingSuccess(false);
    resetPublishedAt();
  };

  const modalizeProps = {
    modalStyle: {
      paddingTop: 0,
    },
    childrenStyle: {
      zIndex: 10,
    },
  };

  const onValidateSuccess = () => {
    showModal(<ScheduleModal articleId={articleId} />, {
      onClose,
      ...modalizeProps,
    });
  };

  return (
    <View style={styles.container}>
      <Button.Primary
        type="ghost"
        icon="CalendarDaysSolid"
        iconSize={14}
        onPress={handleOpenPopupSchedule}
        disabled={disabled}
        loading={isValidating}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    marginRight: spacing.margin.small,
  },
});

export default Schedule;
