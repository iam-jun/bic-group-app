/* eslint-disable no-alert */
import Toggle from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'base/Toggle',
  component: Toggle,
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium'],
    },
  },
} as ComponentMeta<typeof Toggle>;

const StoryComponent = getStoryComponent(Toggle);

export const Default = StoryComponent.bind({});
Default.args = {
  isChecked: false,
  onPress: (
    isChecked: boolean,
  ) => { alert(`Change checked: ${isChecked}`) },
}
