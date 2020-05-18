export default async function (ctx) {
  const user = await ctx.app.$userRepo.myProfile();
  if (!user) {
    ctx.app.$cookies.set('RedirectURI', ctx.route.path);
    ctx.app.$cookies.set('authRequiredMessage', 'true');
    ctx.redirect(301, '/login');
  }
  return true;
}