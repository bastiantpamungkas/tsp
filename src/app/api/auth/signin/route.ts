import { NextRequest } from "next/server"
import crypto from 'crypto'
import prisma from '@/src/lib/prismaClient'

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    if (data.email && data.password) {
        // do nothing
    } else {
        return Response.json({ error: 'Sign in failed. Check the details you provided are correct.'} , { status: 401 })
    }

    const user_data = await prisma.user.findFirst({
        where: {
          email: (data?.email) ? data?.email : '',
        },
    });
    if (user_data) {
        if (user_data.hashed_email_verify) {
            return Response.json({ error: 'Sign in failed. Check the details you provided are correct.'} , { status: 401 })
        }

        try {
            const hashed_password = crypto
                .createHmac('sha1', ((user_data.salt) ? user_data.salt : ''))
                .update(<crypto.BinaryLike>data?.password)
                .digest('hex')
                
            if (hashed_password === user_data.hashed_password) {
                const user = await prisma.user.findUnique({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }, 
                    where: {
                        id: user_data.id
                    },
                });
                return Response.json({ message: '', user})
            } else {
                return Response.json({ error: 'Sign in failed. Check the details you provided are correct.'} , { status: 401 })
            }
        } catch (err) {
            return Response.json({ error: 'Sign in failed. Check the details you provided are correct.'} , { status: 401 })
        }
    } else {
        return Response.json({ error: 'Sign in failed. Check the details you provided are correct.'} , { status: 401 })
    }
}
