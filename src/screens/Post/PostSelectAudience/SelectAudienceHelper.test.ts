import { checkChangeAudiences } from '~/screens/Post/PostSelectAudience/SelectAudienceHelper';

describe('PostSelectAudience helper', () => {
  it('checkChangeAudiences has changed length, return true', () => {
    const a1: any = [{}];
    const a2: any = [{}, {}];
    expect(checkChangeAudiences(a1, a2)).toBeTruthy();
  });
  it('checkChangeAudiences has no changed return false', () => {
    const a1: any = [{ id: 1 }, { id: 2 }];
    const a2: any = [{ id: 1 }, { id: 2 }];
    expect(checkChangeAudiences(a1, a2)).toBeFalsy();
  });
  it('checkChangeAudiences has changed position, return false', () => {
    const a1: any = [{ id: 1 }, { id: 2 }];
    const a2: any = [{ id: 2 }, { id: 1 }];
    expect(checkChangeAudiences(a1, a2)).toBeFalsy();
  });
});
