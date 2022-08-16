/* eslint-disable no-alert */
import { ButtonComponent } from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'components/Button',
  component: ButtonComponent,
} as ComponentMeta<typeof ButtonComponent>;

const StoryComponent = getStoryComponent(ButtonComponent);

export const Primary = StoryComponent.bind({});
Primary.args = {
  variant: 'primary',
  type: 'solid',
  size: 'medium',
  disabled: false,
  loading: false,
  icon: 'iconReact',
  children: 'Button Component',
  onPress: () => { alert('onPress') },
  onLongPress: () => { alert('onLongPress') },
}

export const Secondary = StoryComponent.bind({});
Secondary.args = {
  ...Primary.args,
  variant: 'secondary',
}

export const Neutral = StoryComponent.bind({});
Neutral.args = {
  ...Primary.args,
  variant: 'neutral',
}

export const Success = StoryComponent.bind({});
Success.args = {
  ...Primary.args,
  variant: 'success',
}

export const Danger = StoryComponent.bind({});
Danger.args = {
  ...Primary.args,
  variant: 'danger',
}
