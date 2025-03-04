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
    const isAuthorized = await checkPermission(session, 'transactions')
    if (session && isAuthorized) {
      try {
          let transaction = await prisma.transaction.findUnique({
              select: {
                id: true,
                transaction_date: true,
                qty: true,
                due_date: true,
                description: true,
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
                },
                workorder_id: true,
                workorder: {
                  select: { 
                    id: true,
                    description: true,
                    qty: true,
                    due_date: true,
                    status: {
                        select: { id: true, name: true }
                    },
                    product: {
                        select: { id: true, name: true }
                    },
                    user: {
                        select: { id: true, name: true, email: true, image: true }
                    }
                  }
                },
              },
              where: {
                id: query.params.id,
              },
          });
          if (!transaction) {
              return Response.json({ error: "Transaction not found" }, { status: 400 })
          }
          return Response.json(transaction)
        } catch (err) {
          return Response.json({ error: "Could not retrieve transaction" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'transactionsUpdate')
  if (session && isAuthorized) {
    try {
        let transaction = await prisma.transaction.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (transaction) {
            let data = await req.json();
            data.updated = moment().toDate()
            data.updated_by = session.user.id
            transaction = await prisma.transaction.update({
                where: {
                  id: query.params.id,
                },
                data: data,
            })
        } else {
            return Response.json({ error: "Transaction not found" }, { status: 400 })
        }
        return Response.json(transaction)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'transactionsDelete')
  if (session && isAuthorized) {
    try {
        let deletedTransaction = await prisma.transaction.delete({
            where: {
              id: query.params.id,
            },
        })
          
        return Response.json(deletedTransaction)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}