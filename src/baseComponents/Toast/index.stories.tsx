import { ComponentMeta } from '@storybook/react-native';
import BaseToast, { ToastType } from './BaseToast';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/BaseToast',
  component: BaseToast,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: [ToastType.SUCCESS, ToastType.NEUTRAL, ToastType.ERROR],
    },
  },
} as ComponentMeta<typeof BaseToast>;

const StoryComponent = getStoryComponent(BaseToast);

export const ToastNoIcon = StoryComponent.bind({});
ToastNoIcon.args = {
  type: ToastType.SUCCESS,
  content: 'Internet connection was restored',
};

export const ToastWithIcon = StoryComponent.bind({});
ToastWithIcon.args = {
  ...ToastNoIcon.args,
  icon: 'WifiSolid',
};

export const ToastWithButton = StoryComponent.bind({});
ToastWithButton.args = {
  ...ToastWithIcon.args,
  buttonText: 'Undo',
  onButtonPress: () => { alert('press'); },
};
