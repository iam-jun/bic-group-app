import groupApi from '~/api/GroupApi';
import showError from '~/store/helper/showError';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';

const addWorkExperience = () => async (
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

    await groupApi.addWorkExperience({
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
    console.error('addWorkExperience error: ', err);
    showError(err);
  }
};

export default addWorkExperience;
