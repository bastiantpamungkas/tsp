import moment from 'moment'
import prisma from '../src/lib/prismaClient'

async function main() {
    let permission = await prisma.permission.findFirst({
        where: { 
            name: 'roles'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'roles',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'roles',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'rolesCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'rolesCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'rolesCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'rolesUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'rolesUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'rolesUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'rolesDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'rolesDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'rolesDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'permissions'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'permissions',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'permissions',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'permissionsCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'permissionsCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'permissionsCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'permissionsUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'permissionsUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'permissionsUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'permissionsDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'permissionsDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'permissionsDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'users'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'users',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'users',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'usersCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'usersCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'usersCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'usersUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'usersUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'usersUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'usersDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'usersDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'usersDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'profile'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'profile',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'profile',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'profileUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'profileUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'profileUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'profileDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'profileDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'profileDelete',
                created: moment().toDate()
            }
        })
    }

    let role_admin = await prisma.role.findFirst({
        where: { 
            name: 'Administrator'
        }
    })
    if (role_admin) {
        role_admin = await prisma.role.update({
            where: {
                id: role_admin.id
            },
            data: {
                name: 'Administrator',
                updated: moment().toDate()
            }
        })
    } else {
        role_admin = await prisma.role.create({
            data: {
                name: 'Administrator',
                created: moment().toDate()
            }
        })
    }

    let role_user = await prisma.role.findFirst({
        where: { 
            name: 'User'
        }
    })
    if (role_user) {
        role_user = await prisma.role.update({
            where: {
                id: role_user.id
            },
            data: {
                name: 'User',
                updated: moment().toDate()
            }
        })
    } else {
        role_user = await prisma.role.create({
            data: {
                name: 'User',
                created: moment().toDate()
            }
        })
    }

    const user = await prisma.user.upsert({
        where: { 
            email: 'buzztian_tp@yahoo.com'
        },
        update: {
            updated: moment().toDate()
        },
        create: {
            name: 'buzztian',
            email: 'buzztian_tp@yahoo.com',
            emailVerified: moment().toDate(),
            hashed_password: 'a89c9dc7541259889e208acc2e9f62753350f6d7',
            salt: '1291087156768',
            created: moment().toDate()
        }
    })

    const permissions = await prisma.permission.findMany()
    if (permissions && permissions.length) {
        for (let index = 0; index < permissions.length; index++) {
            const role_permission = await prisma.role_Permission.findFirst({
                where: {
                    role_id: role_admin.id,
                    permission_id: permissions[index].id
                }
            })
            if (role_permission) {
                await prisma.role_Permission.update({
                    where: {
                        id: role_permission.id
                    },
                    data: {
                        role_id: role_admin.id,
                        permission_id: permissions[index].id,
                        updated: moment().toDate()
                    }
                })
                if (permissions[index].name == 'profile' || permissions[index].name == 'profileUpdate' || permissions[index].name == 'profileDelete') {
                    await prisma.role_Permission.update({
                        where: {
                            id: role_permission.id
                        },
                        data: {
                            role_id: role_user.id,
                            permission_id: permissions[index].id,
                            updated: moment().toDate()
                        }
                    })
                }
            } else {
                await prisma.role_Permission.create({
                    data: {
                        role_id: role_admin.id,
                        permission_id: permissions[index].id,
                        created: moment().toDate()
                    }
                })
                if (permissions[index].name == 'profile' || permissions[index].name == 'profileUpdate' || permissions[index].name == 'profileDelete') {
                    await prisma.role_Permission.create({
                        data: {
                            role_id: role_user.id,
                            permission_id: permissions[index].id,
                            created: moment().toDate()
                        }
                    })
                }
            }
        }
    }

    const user_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user.id,
            role_id: role_admin.id
        }
    })
    if (user_role) {
        await prisma.user_Role.update({
            where: {
                id: user_role.id
            },
            data: {
                user_id: user.id,
                role_id: role_admin.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user.id,
                role_id: role_admin.id,
                created: moment().toDate()
            }
        })
    }
}
main()
.catch(async (err) => {
    console.error(err.message)
    process.exit(1)
})
  