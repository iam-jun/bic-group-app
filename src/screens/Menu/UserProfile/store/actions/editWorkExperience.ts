import groupApi from '~/api/GroupApi';
import showError from '~/store/helper/showError';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';

const editWorkExperience = () => async (
  id: string,
  payload: IUserAddWorkExperience,
  callback?: () => void,
) => {
  try {
    const {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    } = payload;

    await groupApi.editWorkExperience(id, {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    });

    callback && callback();
  } catch (err) {
    console.error('editWorkExperience error: ', err);
    showError(err);
  }
};

export default editWorkExperience;
