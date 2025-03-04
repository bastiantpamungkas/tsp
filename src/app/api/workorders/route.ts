import { auth } from "@/src/auth"
import moment from "moment"
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'
import Ajv from "ajv"
import addFormats from "ajv-formats"

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'workorders')
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
              let searchkey = req.nextUrl.searchParams.get('searchkey') as any
              if (req.nextUrl.searchParams.get('searchoperator') == 'isAnyOf') {
                if (Array.isArray(req.nextUrl.searchParams.get('searchkey'))) {
                  if (req.nextUrl.searchParams.get('searchcolumn') == 'qty') {
                    if (searchkey && searchkey.length > 0) {
                      searchkey = searchkey.map((item: any) => {
                        return Number(item)
                      })
                    }
                  }
                } else {
                  if (req.nextUrl.searchParams.get('searchcolumn') == 'qty') {
                    searchkey = [Number(searchkey)]
                  }
                }
              } else {
                if (req.nextUrl.searchParams.get('searchcolumn') == 'due_date') {
                  searchkey = moment(req.nextUrl.searchParams.get('searchkey'))
                } else if (req.nextUrl.searchParams.get('searchcolumn') == 'qty') {
                  searchkey = Number(req.nextUrl.searchParams.get('searchkey'))
                }
              }
            
              if (req.nextUrl.searchParams.get('searchoperator') == 'equals' || req.nextUrl.searchParams.get('searchoperator') == 'is' || req.nextUrl.searchParams.get('searchoperator') == '=') {
                  queryWhere[searchcolumn] = searchkey
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'startsWith') {
                  queryWhere[searchcolumn] = { startsWith: searchkey, mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'endsWith') {
                  queryWhere[searchcolumn] = { endsWith: searchkey, mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'contains') {
                  queryWhere[searchcolumn] =  { contains: searchkey, mode: 'insensitive' }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'isAnyOf') {
                queryWhere[searchcolumn] =  { in: searchkey }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '>' || req.nextUrl.searchParams.get('searchoperator') == 'after') {
                queryWhere[searchcolumn] =  { gt: searchkey }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '>=' || req.nextUrl.searchParams.get('searchoperator') == 'onOrAfter') {
                queryWhere[searchcolumn] =  { gte: searchkey }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '<' || req.nextUrl.searchParams.get('searchoperator') == 'before') {
                queryWhere[searchcolumn] =  { lt: searchkey }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '<=' || req.nextUrl.searchParams.get('searchoperator') == 'onOrBefore') {
                queryWhere[searchcolumn] =  { lte: searchkey }
              } else if (req.nextUrl.searchParams.get('searchoperator') == '!=' || req.nextUrl.searchParams.get('searchoperator') == 'not') {
                queryWhere[searchcolumn] =  { not: searchkey }
              }
              
              if (req.nextUrl.searchParams.get('searchcolumn') == 'product_id') {
                queryWhere = {
                  product: {
                    name : queryWhere[searchcolumn]
                  }
                }
              } else if (req.nextUrl.searchParams.get('searchcolumn') == 'user_id') {
                queryWhere = {
                  user: {
                    name : queryWhere[searchcolumn]
                  }
                }
              } else if (req.nextUrl.searchParams.get('searchcolumn') == 'created_by') {
                queryWhere = {
                  created_user: {
                    name : queryWhere[searchcolumn]
                  }
                }
              }
          }
      }

      const checkOperator = await prisma.user.findFirst({
        where: { 
          id: req.auth.user.id,
          user_role: {
            some: {
              role: {
                name: 'Operator'
              }
            }
          }
        },
      })
      if (checkOperator) {
        queryWhere['user_id'] = req.auth.user.id
      }
  
      let total = await prisma.workorder.count()
      let workorders = await prisma.workorder.findMany({
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
        skip: (limit >= 0 ) ? offset : undefined, 
        take: (limit >= 0 ) ? limit : undefined, 
        orderBy: [sort]
      })
      return Response.json({ count: total, rows: workorders })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const POST = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'workordersCreate')
  if (req.auth && isAuthorized) {
    try {
        let data = await req.json();
        data.created = moment().toDate()
        data.created_by = req.auth.user.id

        const schema = {
          properties: {
            due_date: {type: "string", format: "date-time"},
            product_id: {type: "string"},
            description: {type: "string"},
            qty: {type: "number"},
            status_id: {type: "string"},
            user_id: {type: "string"}
          },
          required: ["due_date", "product_id", "qty", "status_id", "user_id"],
        }
        const ajv = new Ajv()
        addFormats(ajv)
        const validate = ajv.compile(schema)
        const dataToValidate = data
        const valid = validate(dataToValidate)
        if (!valid) {
          return Response.json({ error: (validate.errors && validate.errors.length) ? validate.errors[0].message : 'Validation Error' }, { status: 400 })
        }

        const workorder = await prisma.workorder.create({
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
            created_by: req.auth.user.id,
            due_date: workorder.due_date,
            user_id: workorder.user_id
          }
        })
        return Response.json({ message: "Successfully create workorder!", workorder })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const DELETE = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'workordersDelete')
  if (req.auth && isAuthorized) {
    try {
      const data = await req.json();
      const Ids = data.Ids

      const checkOperator = await prisma.user.findFirst({
        where: { 
          id: req.auth.user.id,
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
      queryWhere['id'] = {
        in: Ids,
      }
      if (checkOperator) {
        queryWhere['user_id'] = req.auth.user.id
      }

      await prisma.workorder.deleteMany({
        where: queryWhere,
      })

      return Response.json({ message: "Successfully delete selected workorders!" })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any