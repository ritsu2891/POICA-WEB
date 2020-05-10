const Cookies = require('js-cookie');
import * as UserRepo from '~/repos/UserRepo'

export default async function (ctx) {
  const user = await UserRepo.myProfile();
  if (!user) {
    Cookies.set('RedirectURI', ctx.route.path);
    Cookies.set('authRequiredMessage', 'true');
    ctx.redirect(301, '/login');
  }
  return true;
}