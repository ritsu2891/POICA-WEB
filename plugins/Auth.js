export default ({ app }, inject) => {
  inject('currentUser', () => {
    return app.$userRepo.myProfile();
  });
}