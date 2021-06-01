describe('SIGNUP', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have components', async () => {
    await expect(element(by.id('textSignup'))).toBeVisible();
    await element(by.id('textSignup')).tap();
  });

  it('should show sign up screen', async () => {
    await expect(element(by.id('SignUpScreen'))).toBeVisible();
  });

  it('should have components form', async () => {
    await expect(element(by.id('inputUsername'))).toBeVisible();
    await expect(element(by.id('inputEmail'))).toBeVisible();
    await expect(element(by.id('inputPassword'))).toBeVisible();
    await expect(element(by.id('btnSignUp'))).toBeVisible();
    await expect(element(by.id('textSignin'))).toBeVisible();
  });

  it('should fill signup form', async () => {
    await element(by.id('inputUsername')).typeText('nhuhung');
    await element(by.id('inputEmail')).typeText('tanhuhung@tgm.vn');
    await element(by.id('inputPassword')).typeText('Password1$');
    await element(by.id('btnSignUp')).tap();
  });

   it('should show alert success', async () => {
    await expect(element(by.id('alertModal'))).toBeVisible();
    await expect(element(by.id('textAlertConfirm'))).toBeVisible();
    await element(by.id('textAlertConfirm')).tap();
  });

  it('should show signin screen', async () => {
    await expect(element(by.id('SignInScreen'))).toBeVisible();
  });
});
// to do: Write e2e test forgotpassword
