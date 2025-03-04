import type UserTypes from '@/next-user';

export default (userData : UserTypes.IUser, role: string) => {
  let checkRole = false
  if (userData && userData.user_role) {
    for (var i = 0; i < userData.user_role.length; i++) {
      if (userData.user_role[i] && userData.user_role[i].role && userData.user_role[i].role.name == role) {
        checkRole = true
      }
    }
  }
  return checkRole
}

