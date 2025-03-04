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
    const isAuthorized = await checkPermission(session, 'workorders')
    if (session && isAuthorized) {
      try {
          const checkOperator = await prisma.user.findFirst({
            where: { 
              id: session.user.id,
              user_role: {
                some: {
                  role: {
                    name: 'Operator'
                  }
                }
              }
            },
          })
          
          let queryWhere = <any>{};
          queryWhere['id'] = query.params.id
          if (checkOperator) {
            queryWhere['user_id'] = session.user.id
          }

          let workorder = await prisma.workorder.findUnique({
              select: {
                  id: true,
                  description: true,
                  qty: true,
                  due_date: true,
                  status_id: true,
                  status: {
                      select: { id: true, name: true }
                  },
                  product_id: true,
                  product: {
                      select: { id: true, name: true }
                  },
                  user_id: true,
                  user: {
                      select: { id: true, name: true, email: true, image: true }
                  },
                  created_by: true,
                  created_user: {
                    select: { id: true, name: true, email: true, image: true }
                  }
              },
              where: queryWhere,
          });
          if (!workorder) {
              return Response.json({ error: "Workorder not found" }, { status: 400 })
          }
          return Response.json(workorder)
        } catch (err) {
          return Response.json({ error: "Could not retrieve workorder" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'workordersUpdate')
  if (session && isAuthorized) {
    try {
        const checkOperator = await prisma.user.findFirst({
          where: { 
            id: session.user.id,
            user_role: {
              some: {
                role: {
                  name: 'Operator'
                }
              }
            }
          },
        })
        
        let queryWhere = <any>{};
        queryWhere['id'] = query.params.id
        if (checkOperator) {
          queryWhere['user_id'] = session.user.id
        }

        let workorder = await prisma.workorder.findUnique({
            where: queryWhere,
        });
        if (workorder) {
            let data = await req.json();
            data.updated = moment().toDate()
            data.updated_by = session.user.id
            workorder = await prisma.workorder.update({
                where: queryWhere,
                data: data,
            })

            await prisma.transaction.create({
              data: {
                workorder_id: workorder.id,
                transaction_date: moment().toDate(),
                product_id: workorder.product_id,
                description: workorder.description,
                qty: workorder.qty,
                status_id: workorder.status_id,
                created: moment().toDate(),
                created_by: session.user.id,
                due_date: workorder.due_date,
                user_id: workorder.user_id
              }
            })
        } else {
            return Response.json({ error: "Workorder not found" }, { status: 400 })
        }
        return Response.json(workorder)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'workordersDelete')
  if (session && isAuthorized) {
    try {
        const checkOperator = await prisma.user.findFirst({
          where: { 
            id: session.user.id,
            user_role: {
              some: {
                role: {
                  name: 'Operator'
                }
              }
            }
          },
        })
        
        let queryWhere = <any>{};
        queryWhere['id'] = query.params.id
        if (checkOperator) {
          queryWhere['user_id'] = session.user.id
        }

        let deletedWorkorder = await prisma.workorder.delete({
            where: queryWhere,
        })
          
        return Response.json(deletedWorkorder)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}