import { ComponentMeta } from '@storybook/react-native';
import SearchInput from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/SearchInput',
  component: SearchInput,
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
  },
} as ComponentMeta<typeof SearchInput>;

const StoryComponent = getStoryComponent(SearchInput);

export const Default = StoryComponent.bind({});
Default.args = {
  size: 'medium',
  placeholder: 'Search input placeholder',
};
