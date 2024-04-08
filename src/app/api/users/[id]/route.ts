// This is an example of to protect an API route
import { NextRequest } from "next/server"
import { auth } from "@/src/auth"
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

interface QueryParams {
  params: {
    id: string
  }
}

export const GET = async (req: NextRequest, query: QueryParams) => {
    const session = await auth()
    const isAuthorized = await checkPermission(session, 'users')
    if (session && isAuthorized) {
      try {
          let user = await prisma.user.findUnique({
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
                                  description: true
                              }
                          }
                      }
                  }
              },      
              where: {
                id: query.params.id,
              },
          });
          if (!user) {
              return Response.json({ error: "User not found" }, { status: 400 })
          }
          return Response.json(user)
        } catch (err) {
          return Response.json({ error: "Could not retrieve user" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'usersUpdate')
  if (session && isAuthorized) {
    try {
        let user = await prisma.user.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (user) {
            let data = await req.json();
            await prisma.user_Role.deleteMany({
              where: {
                  user_id : user.id,
              },
            })
            user = await prisma.user.update({
                where: {
                    id: query.params.id,
                },
                data: {
                    name: data.name,
                    email: data.email,
                    updated: moment().toDate(),
                    user_role: (data.roles && data.roles.length) ? { 
                        create: data.roles.map((item: any, y: number) => {
                            return { 
                                role_id : item, 
                                created_by: session.user.id, 
                                updated_by: session.user.id, 
                                created: (user?.created) ? user?.created : undefined, 
                                updated: moment().toDate()
                            }
                        }) 
                    } : undefined
                },
            })
        } else {
            return Response.json({ error: "User not found" }, { status: 400 })
        }
        return Response.json(user)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'usersDelete')
  if (session && isAuthorized) {
    try {
        let deletedUser = await prisma.user.delete({
            where: {
              id: query.params.id,
            },
        })
        return Response.json(deletedUser)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}