import type UserTypes from '@/next-user';

export default (userData : UserTypes.IUser, permission: string) => {
  let checkPermission = false
  if (userData && userData.user_role) {
    for (var i = 0; i < userData.user_role.length; i++) {
      if (userData.user_role[i] && userData.user_role[i].role && userData.user_role[i].role.role_permission) {
        for (var x = 0; x < userData.user_role[i].role.role_permission.length; x++) {
          if (userData.user_role[i].role.role_permission[x].permission) {
            if (userData.user_role[i].role.role_permission[x].permission.name == permission) {
              checkPermission = true
            }
          }
        }
      }
    }
  }
  return checkPermission
}

