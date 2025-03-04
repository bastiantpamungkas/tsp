// This is an example of to protect an API route
import { NextRequest } from "next/server"
import { auth } from "@/src/auth"
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

interface QueryParams {
  params: any
}

export const GET = async (req: NextRequest, query: QueryParams) => {
    const session = await auth()
    const isAuthorized = await checkPermission(session, 'status')
    if (session && isAuthorized) {
      try {
          let status = await prisma.status.findUnique({
              where: {
                id: query.params.id,
              },
          });
          if (!status) {
              return Response.json({ error: "Status not found" }, { status: 400 })
          }
          return Response.json(status)
        } catch (err) {
          return Response.json({ error: "Could not retrieve status" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'statusUpdate')
  if (session && isAuthorized) {
    try {
        let status = await prisma.status.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (status) {
            let data = await req.json();
            data.updated = moment().toDate()
            data.updated_by = session.user.id
            status = await prisma.status.update({
                where: {
                  id: query.params.id,
                },
                data: data,
            })
        } else {
            return Response.json({ error: "Status not found" }, { status: 400 })
        }
        return Response.json(status)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'statusDelete')
  if (session && isAuthorized) {
    try {
        let deletedStatus = await prisma.status.delete({
            where: {
              id: query.params.id,
            },
        })
          
        return Response.json(deletedStatus)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}