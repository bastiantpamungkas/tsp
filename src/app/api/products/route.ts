import { auth } from "@/src/auth"
import moment from "moment"
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'products')
  if (req.auth && isAuthorized) {
    try {
      const offset = (req.nextUrl.searchParams.get('offset')) ? Number(req.nextUrl.searchParams.get('offset')) : 0
      const limit = (req.nextUrl.searchParams.get('limit')) ? Number(req.nextUrl.searchParams.get('limit')) : 100
      const column = (req.nextUrl.searchParams.get('column')) ? <string>req.nextUrl.searchParams.get('column') : 'id'
      const dir = (req.nextUrl.searchParams.get('dir')) ? req.nextUrl.searchParams.get('dir') : 'desc'
      let sort = <any>{}
      sort[column] = dir

      const searchcolumn = <string>req.nextUrl.searchParams.get('searchcolumn')
      let queryWhere = <any>{};
      if (req.nextUrl.searchParams.get('searchoperator') == 'isEmpty' || req.nextUrl.searchParams.get('searchoperator') == 'isNotEmpty') {
          if (req.nextUrl.searchParams.get('searchoperator') == 'isEmpty') {
              
              queryWhere[searchcolumn] = null
          } else {
              queryWhere[searchcolumn] = {not: null}
          }
      } else {
          if (req.nextUrl.searchParams.get('searchcolumn') && req.nextUrl.searchParams.get('searchkey') && req.nextUrl.searchParams.get('searchoperator')) {
              if (req.nextUrl.searchParams.get('searchoperator') == 'equals' || req.nextUrl.searchParams.get('searchoperator') == 'is' || req.nextUrl.searchParams.get('searchoperator') == '=') {
                  queryWhere[searchcolumn] = req.nextUrl.searchParams.get('searchkey')
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'startsWith') {
                  queryWhere[searchcolumn] = { startsWith: req.nextUrl.searchParams.get('searchkey'), mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'endsWith') {
                  queryWhere[searchcolumn] = { endsWith: req.nextUrl.searchParams.get('searchkey'), mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'contains') {
                  queryWhere[searchcolumn] =  { contains: req.nextUrl.searchParams.get('searchkey'), mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'isAnyOf') {
                if (Array.isArray(req.nextUrl.searchParams.get('searchkey'))) {
                  queryWhere[searchcolumn] =  { in: req.nextUrl.searchParams.get('searchkey') }
                } else {
                  queryWhere[searchcolumn] =  { in: [req.nextUrl.searchParams.get('searchkey')] }
                }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '>' || req.nextUrl.searchParams.get('searchoperator') == 'after') {
                queryWhere[searchcolumn] =  { gt: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '>=' || req.nextUrl.searchParams.get('searchoperator') == 'onOrAfter') {
                queryWhere[searchcolumn] =  { gte: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '<' || req.nextUrl.searchParams.get('searchoperator') == 'before') {
                queryWhere[searchcolumn] =  { lt: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '<=' || req.nextUrl.searchParams.get('searchoperator') == 'onOrBefore') {
                queryWhere[searchcolumn] =  { lte: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '!=' || req.nextUrl.searchParams.get('searchoperator') == 'not') {
                queryWhere[searchcolumn] =  { not: req.nextUrl.searchParams.get('searchkey') }
              }  
          }
      }
  
      let total = await prisma.product.count()
      let products = await prisma.product.findMany({
        where: queryWhere, 
        skip: (limit >= 0 ) ? offset : undefined, 
        take: (limit >= 0 ) ? limit : undefined, 
        orderBy: [sort]
      })
      return Response.json({ count: total, rows: products })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const POST = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'productsCreate')
  if (req.auth && isAuthorized) {
    try {
        let data = await req.json();
        data.created = moment().toDate()
        data.created_by = req.auth.user.id
        const product = await prisma.product.create({
          data: data,
        })
        return Response.json({ message: "Successfully create product!", product })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const DELETE = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'productsDelete')
  if (req.auth && isAuthorized) {
    try {
      const data = await req.json();
      const Ids = data.Ids
      await prisma.product.deleteMany({
        where: {
          id: {
            in: Ids,
          },
        },
      })

      return Response.json({ message: "Successfully delete selected products!" })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any