describe('LOGIN', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have components', async () => {
    await expect(element(by.id('inputEmail'))).toBeVisible();
    await expect(element(by.id('inputPassword'))).toBeVisible();
    await expect(element(by.id('btnLogin'))).toBeVisible();
  });

  it('should fill login form', async () => {
    await element(by.id('inputEmail')).typeText('evol@mailinator.com\n');
    await element(by.id('inputPassword')).typeText('ABCxyz123@\n');
    await element(by.id('btnLogin')).tap();
  });

  it('should show home screen', async () => {
    setTimeout(async() => {
      await expect(element(by.id('HomeScreen'))).toBeVisible();
    },1000)
  });
});
