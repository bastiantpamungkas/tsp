import prisma from '@/src/lib/prismaClient'

export default async (user: any,  permission: string) => {
  let checkPermission = false
  if (user && user.user.id) {
    const data = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          user_role: {
            select: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        role_permission: {
                            select: {
                                permission: {
                                    select: {
                                        id: true,
                                        name: true,
                                        description: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }
        },      
        where: {
          id: user.user.id,
        },
    });
    if (data && data.user_role) {
      for (var i = 0; i < data.user_role.length; i++) {
        if (data.user_role[i] && data.user_role[i].role && data.user_role[i].role.role_permission) {
          for (var x = 0; x < data.user_role[i].role.role_permission.length; x++) {
            if (data.user_role[i].role.role_permission[x].permission) {
              if (data.user_role[i].role.role_permission[x].permission.name == permission) {
                checkPermission = true
              }
            }
          }
        }
      }
    }
  }
  return checkPermission
}

