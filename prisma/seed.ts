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

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'operators'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'operators',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'operators',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'status'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'status',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'status',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'statusCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'statusCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'statusCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'statusUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'statusUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'statusUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'statusDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'statusDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'statusDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'products'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'products',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'products',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'productsCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'productsCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'productsCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'productsUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'productsUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'productsUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'productsDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'productsDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'productsDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'workorders'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'workorders',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'workorders',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'workordersCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'workordersCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'workordersCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'workordersUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'workordersUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'workordersUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'workordersDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'workordersDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'workordersDelete',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'transactions'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'transactions',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'transactions',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'transactionsCreate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'transactionsCreate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'transactionsCreate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'transactionsUpdate'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'transactionsUpdate',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'transactionsUpdate',
                created: moment().toDate()
            }
        })
    }

    permission = await prisma.permission.findFirst({
        where: { 
            name: 'transactionsDelete'
        }
    })
    if (permission) {
        await prisma.permission.update({
            where: {
                id: permission.id
            },
            data: {
                name: 'transactionsDelete',
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.permission.create({
            data: {
                name: 'transactionsDelete',
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

    let role_prod_manager = await prisma.role.findFirst({
        where: { 
            name: 'Production Manager'
        }
    })
    if (role_prod_manager) {
        role_prod_manager = await prisma.role.update({
            where: {
                id: role_prod_manager.id
            },
            data: {
                name: 'Production Manager',
                updated: moment().toDate()
            }
        })
    } else {
        role_prod_manager = await prisma.role.create({
            data: {
                name: 'Production Manager',
                created: moment().toDate()
            }
        })
    }

    let role_operator = await prisma.role.findFirst({
        where: { 
            name: 'Operator'
        }
    })
    if (role_operator) {
        role_operator = await prisma.role.update({
            where: {
                id: role_operator.id
            },
            data: {
                name: 'Operator',
                updated: moment().toDate()
            }
        })
    } else {
        role_operator = await prisma.role.create({
            data: {
                name: 'Operator',
                created: moment().toDate()
            }
        })
    }

    await prisma.status.deleteMany();
    await prisma.status.create({
        data: {
            name: 'Pending',
            created: moment().toDate()
        }
    })
    await prisma.status.create({
        data: {
            name: 'In Progress',
            created: moment().toDate()
        }
    })
    await prisma.status.create({
        data: {
            name: 'Completed',
            created: moment().toDate()
        }
    })
    await prisma.status.create({
        data: {
            name: 'Canceled',
            created: moment().toDate()
        }
    })

    await prisma.product.deleteMany();
    await prisma.product.create({
        data: {
            name: 'Digital Watch',
            price: 1500000,
            created: moment().toDate()
        }
    })
    await prisma.product.create({
        data: {
            name: 'Starlink Jetpack',
            price: 30500000,
            created: moment().toDate()
        }
    })
    await prisma.product.create({
        data: {
            name: 'Go Pro',
            price: 2500000,
            created: moment().toDate()
        }
    })
    await prisma.product.create({
        data: {
            name: 'Cofee Maker',
            price: 1250000,
            created: moment().toDate()
        }
    })

    const user_admin = await prisma.user.upsert({
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

    const user_prod_manager = await prisma.user.upsert({
        where: { 
            email: 'prod.manager1@gmail.com'
        },
        update: {
            updated: moment().toDate()
        },
        create: {
            name: 'prod manager1',
            email: 'prod.manager1@gmail.com',
            emailVerified: moment().toDate(),
            hashed_password: 'a89c9dc7541259889e208acc2e9f62753350f6d7',
            salt: '1291087156768',
            created: moment().toDate()
        }
    })

    const user_operator1 = await prisma.user.upsert({
        where: { 
            email: 'operator1@gmail.com'
        },
        update: {
            updated: moment().toDate()
        },
        create: {
            name: 'operator1',
            email: 'operator1@gmail.com',
            emailVerified: moment().toDate(),
            hashed_password: 'a89c9dc7541259889e208acc2e9f62753350f6d7',
            salt: '1291087156768',
            created: moment().toDate()
        }
    })

    const user_operator2 = await prisma.user.upsert({
        where: { 
            email: 'operator2@gmail.com'
        },
        update: {
            updated: moment().toDate()
        },
        create: {
            name: 'operator2',
            email: 'operator2@gmail.com',
            emailVerified: moment().toDate(),
            hashed_password: 'a89c9dc7541259889e208acc2e9f62753350f6d7',
            salt: '1291087156768',
            created: moment().toDate()
        }
    })

    const user_operator3 = await prisma.user.upsert({
        where: { 
            email: 'operator3@gmail.com'
        },
        update: {
            updated: moment().toDate()
        },
        create: {
            name: 'operator3',
            email: 'operator3@gmail.com',
            emailVerified: moment().toDate(),
            hashed_password: 'a89c9dc7541259889e208acc2e9f62753350f6d7',
            salt: '1291087156768',
            created: moment().toDate()
        }
    })

    const permissions = await prisma.permission.findMany()
    if (permissions && permissions.length) {
        await prisma.role_Permission.deleteMany();
        for (let index = 0; index < permissions.length; index++) {
            await prisma.role_Permission.create({
                data: {
                    role_id: role_admin.id,
                    permission_id: permissions[index].id,
                    created: moment().toDate()
                }
            })

            if (permissions[index].name == 'productsCreate' || permissions[index].name == 'productsUpdate' || permissions[index].name == 'transactions') {
                await prisma.role_Permission.create({
                    data: {
                        role_id: role_prod_manager.id,
                        permission_id: permissions[index].id,
                        created: moment().toDate()
                    }
                })
            }

            if (permissions[index].name == 'profile' || permissions[index].name == 'profileUpdate' || permissions[index].name == 'profileDelete' || permissions[index].name == 'status' || permissions[index].name == 'operators' || permissions[index].name == 'products' || permissions[index].name == 'workorders' || permissions[index].name == 'workordersCreate' || permissions[index].name == 'workordersUpdate') {
                await prisma.role_Permission.create({
                    data: {
                        role_id: role_prod_manager.id,
                        permission_id: permissions[index].id,
                        created: moment().toDate()
                    }
                })

                if (permissions[index].name != 'workordersCreate') {
                    await prisma.role_Permission.create({
                        data: {
                            role_id: role_operator.id,
                            permission_id: permissions[index].id,
                            created: moment().toDate()
                        }
                    })
                }
            }
        }
    }

    const admin_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user_admin.id,
            role_id: role_admin.id
        }
    })
    if (admin_role) {
        await prisma.user_Role.update({
            where: {
                id: admin_role.id
            },
            data: {
                user_id: user_admin.id,
                role_id: role_admin.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user_admin.id,
                role_id: role_admin.id,
                created: moment().toDate()
            }
        })
    }

    const prod_manager_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user_prod_manager.id,
            role_id: role_prod_manager.id
        }
    })
    if (prod_manager_role) {
        await prisma.user_Role.update({
            where: {
                id: prod_manager_role.id
            },
            data: {
                user_id: user_prod_manager.id,
                role_id: role_prod_manager.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user_prod_manager.id,
                role_id: role_prod_manager.id,
                created: moment().toDate()
            }
        })
    }

    const operator1_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user_operator1.id,
            role_id: role_operator.id
        }
    })
    if (operator1_role) {
        await prisma.user_Role.update({
            where: {
                id: operator1_role.id
            },
            data: {
                user_id: user_operator1.id,
                role_id: role_operator.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user_operator1.id,
                role_id: role_operator.id,
                created: moment().toDate()
            }
        })
    }

    const operator2_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user_operator2.id,
            role_id: role_operator.id
        }
    })
    if (operator2_role) {
        await prisma.user_Role.update({
            where: {
                id: operator2_role.id
            },
            data: {
                user_id: user_operator2.id,
                role_id: role_operator.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user_operator2.id,
                role_id: role_operator.id,
                created: moment().toDate()
            }
        })
    }

    const operator3_role = await prisma.user_Role.findFirst({
        where: {
            user_id: user_operator3.id,
            role_id: role_operator.id
        }
    })
    if (operator3_role) {
        await prisma.user_Role.update({
            where: {
                id: operator3_role.id
            },
            data: {
                user_id: user_operator3.id,
                role_id: role_operator.id,
                updated: moment().toDate()
            }
        })
    } else {
        await prisma.user_Role.create({
            data: {
                user_id: user_operator3.id,
                role_id: role_operator.id,
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
  