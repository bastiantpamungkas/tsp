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
    const isAuthorized = await checkPermission(session, 'products')
    if (session && isAuthorized) {
      try {
          let product = await prisma.product.findUnique({
              where: {
                id: query.params.id,
              },
          });
          if (!product) {
              return Response.json({ error: "Product not found" }, { status: 400 })
          }
          return Response.json(product)
        } catch (err) {
          return Response.json({ error: "Could not retrieve product" }, { status: 400 })
      }
    } else {
      return Response.json({ error: "Not Authorized" }, { status: 400 })
    }
}

export const PUT = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'productsUpdate')
  if (session && isAuthorized) {
    try {
        let product = await prisma.product.findUnique({
            where: {
              id: query.params.id,
            },
        });
        if (product) {
            let data = await req.json();
            data.updated = moment().toDate()
            data.updated_by = session.user.id
            product = await prisma.product.update({
                where: {
                  id: query.params.id,
                },
                data: data,
            })
        } else {
            return Response.json({ error: "Product not found" }, { status: 400 })
        }
        return Response.json(product)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest, query: QueryParams) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'productsDelete')
  if (session && isAuthorized) {
    try {
        let deletedProduct = await prisma.product.delete({
            where: {
              id: query.params.id,
            },
        })
          
        return Response.json(deletedProduct)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not Authorized" }, { status: 400 })
  }
}