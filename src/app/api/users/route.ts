import { auth } from "@/src/auth"
import crypto from 'crypto'
import moment from "moment"
import nodemailer from 'nodemailer'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'
import template_email from '@/src/email/signup.template'

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'users')
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
                  queryWhere[searchcolumn] = { startsWith: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'endsWith') {
                  queryWhere[searchcolumn] = { endsWith: req.nextUrl.searchParams.get('searchkey') }
              } else if (req.nextUrl.searchParams.get('searchoperator') == 'contains') {
                  queryWhere[searchcolumn] =  { contains: req.nextUrl.searchParams.get('searchkey') }
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
  
      let total = await prisma.user.count()
      let users = await prisma.user.findMany({
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
        where: queryWhere, 
        skip: offset, 
        take: limit, 
        orderBy: [sort]
      })
      return Response.json({ count: total, rows: users })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const POST = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'usersCreate')
  if (req.auth && isAuthorized) {
    try {
        let data = await req.json();
        if (data.password != data.password_confirm) {
          return Response.json({ error: "Password & Password Confirm don't match" }, { status: 400 })
        }

        if (!String(data.email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          return Response.json({ error: "Please fill a valid email address" }, { status: 400 })
        }

        let user = {} as any
        user.name = data.name
        user.email = data.email
        user.salt = Math.round((new Date().valueOf() * Math.random())) + ''
        user.hashed_password = crypto
            .createHmac('sha1', user.salt)
            .update(data.password)
            .digest('hex')
        user.created = moment().toDate()
        user.hashed_email_verify = crypto
            .createHmac('sha1', user.salt)
            .update(data.email)
            .digest('hex')

        if (data.roles && data.roles.length) {
          user.user_role = {
            create: data.roles.map((item: any, y: number) => {
                return { 
                    role_id : item, 
                    created_by: req.auth?.user.id, 
                    created: moment().toDate(), 
                }
            }) 
          }
        }

        user = await prisma.user.create({
            data: user,
        })

        const hashed_email_verify = user.hashed_email_verify
        
        user.hashed_password = undefined
        user.salt = undefined
        user.emailVerified = undefined
        user.hashed_email_verify = undefined

        let from = (process.env.MAIL_FROM_ADDRESS) ? '"info ' + process.env.MAIL_FROM_NAME + '" ' + '<' + process.env.MAIL_FROM_ADDRESS + '>' : '' // sender address
        let to = data.email // list of receivers
        let subject = "Verify Email Address" // Subject line
        let html = template_email(user, process.env.AUTH_URL + '/auth/verify/' + hashed_email_verify) // html body
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD }
        });

        await transporter.sendMail({ from: from, to: to, subject: subject, html: html })
        .then(async response => {
            //console.log(response)
        })
        .catch(async err_email => {
            return Response.json({ error: err_email, user }, { status: 400 })
        });
        return Response.json({ message: "Successfully create user!", user })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const DELETE = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'usersDelete')
  if (req.auth && isAuthorized) {
    try {
      const data = await req.json();
      const Ids = data.Ids
      await prisma.user.deleteMany({
        where: {
          id: {
            in: Ids,
          },
        },
      })

      return Response.json({ message: "Successfully delete selected users!" })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any