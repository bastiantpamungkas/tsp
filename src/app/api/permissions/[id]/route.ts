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
    const isAuthorized = await checkPermission(session, 'permissions')
    if (session && isAuthorized) {
      try {
          let permission = await prisma.permission.findUnique({
              where: {
                id: query.params.id,
              },
          });
          if (!permission) {
              return Response.json({ error: "Permission not found" }, { status: 400 })
          }
          return Response.json(permission)
        } catch (err) {
          return Response.json({ error: "Could not retrieve permission" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'permissionsUpdate')
  if (session && isAuthorized) {
    try {
        let permission = await prisma.permission.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (permission) {
            let data = await req.json();
            data.updated = moment().toDate()
            data.updated_by = session.user.id
            permission = await prisma.permission.update({
                where: {
                  id: query.params.id,
                },
                data: data,
            })
        } else {
            return Response.json({ error: "Permission not found" }, { status: 400 })
        }
        return Response.json(permission)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'permissionsDelete')
  if (session && isAuthorized) {
    try {
        let deletedPermission = await prisma.permission.delete({
            where: {
              id: query.params.id,
            },
        })
          
        return Response.json(deletedPermission)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}