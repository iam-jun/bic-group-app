import showToastError from '~/store/helper/showToastError';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';
import userApi from '~/api/UserApi';

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

    await userApi.addWorkExperience({
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
    showToastError(err);
  }
};

export default addWorkExperience;
