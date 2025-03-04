// This is an example of to protect an API route
import { NextRequest } from "next/server"
import { auth } from "@/src/auth"
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'
import Ajv from "ajv"

interface QueryParams {
  params: any
}

export const GET = async (req: NextRequest, query: QueryParams) => {
    const session = await auth()
    const isAuthorized = await checkPermission(session, 'roles')
    if (session && isAuthorized) {
      try {
          let role = await prisma.role.findUnique({
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
              },      
              where: {
                id: query.params.id,
              },
          });
          if (!role) {
              return Response.json({ error: "Role not found" }, { status: 400 })
          }
          return Response.json(role)
        } catch (err) {
          return Response.json({ error: "Could not retrieve role" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'rolesUpdate')
  if (session && isAuthorized) {
    try {
        let role = await prisma.role.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (role) {
            let data = await req.json();

            const schema = {
              properties: {
                name: {type: "string"},
                description: {type: "string"}
              },
              required: ["name"],
            }
            const ajv = new Ajv()
            const validate = ajv.compile(schema)
            const dataToValidate = data
            const valid = validate(dataToValidate)
            if (!valid) {
              return Response.json({ error: (validate.errors && validate.errors.length) ? validate.errors[0].message : 'Validation Error' }, { status: 400 })
            }

            await prisma.role_Permission.deleteMany({
                where: {
                    role_id : role.id,
                },
            })
            role = await prisma.role.update({
                where: {
                    id: query.params.id,
                },
                data: {
                    name: data.name,
                    description: data.description,
                    updated_by: session.user.id,
                    updated: moment().toDate(),
                    role_permission: (data.permissions && data.permissions.length) ? { 
                        create: data.permissions.map((item: any, y: number) => {
                            return { 
                                permission_id : item, 
                                created_by: (role?.created_by) ? role?.created_by : undefined, 
                                updated_by: session.user.id, 
                                created: (role?.created) ? role?.created : undefined, 
                                updated: moment().toDate() 
                            }
                        }) 
                    } : undefined
                },
            })
        } else {
            return Response.json({ error: "Role not found" }, { status: 400 })
        }
        return Response.json(role)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'rolesDelete')
  if (session && isAuthorized) {
    try {
        let deletedRole = await prisma.role.delete({
            where: {
              id: query.params.id,
            },
        })
          
        return Response.json(deletedRole)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}