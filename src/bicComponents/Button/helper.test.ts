import { useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import {
  getButtonColors,
} from './helper';

describe('Button helper', () => {

  it('getButtonColors with theme', () => {
    const theme = useTheme();
    const result = getButtonColors(theme);
    
    expect(Object.keys(result).length).toEqual(5);
  });

});
