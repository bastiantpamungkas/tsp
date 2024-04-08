import { NextRequest } from "next/server"
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import parseUrl from '@/src/lib/parseUrl';
import template_email from '@/src/email/signup.template'

export const POST = async (req: NextRequest) => {
    const data = await req.json();

    if (data.password != data.password_confirm) {
        return Response.json({ error: "Password & Password Confirm don't match" }, { status: 400 })
    }
    if (!data.terms) {
        return Response.json({ error: "Please select agree terms & condition to continues" }, { status: 400 })
    }

    const parsedUrl = parseUrl(process.env.NEXTAUTH_URL) as any;
    const baseUrl = parsedUrl.base;
    const useSecureCookies = baseUrl.startsWith('https://')
    const csrfProp = `${useSecureCookies ? '__Host-' : ''}authjs.csrf-token`;
    let checkCsrf = false 

    if (req.cookies.get(csrfProp)) {
        const CookieCsrfToken = req.cookies.get(csrfProp)
        if (CookieCsrfToken?.value) {
            if (CookieCsrfToken?.value.split('|') && CookieCsrfToken?.value.split('|')[0]) {    
                if (CookieCsrfToken?.value.split('|')[0] == data.csrfToken) {
                    checkCsrf = true
                }
            }
        }
    }
    if (!checkCsrf) {
        return Response.json({ error: "Token Invalid" }, { status: 400 })
    }

    try {
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

        user = await prisma.user.create({
            data: user,
        })

        const hashed_email_verify = user.hashed_email_verify
        
        user.hashed_password = undefined
        user.salt = undefined
        user.emailVerified = undefined
        user.hashed_email_verify = undefined

        let from = (process.env.MAIL_FROM_ADDRESS) ? '"info ' + process.env.MAIL_FROM_NAME + '" ' + '<' + process.env.MAIL_FROM_ADDRESS + '>' : '' // sender address
        let to = user.email // list of receivers
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
}
