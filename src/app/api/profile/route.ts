import { auth } from "@/src/auth"
import crypto from 'crypto'
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'profile')
  if (req.auth && isAuthorized) {
    try {
      let profile = await prisma.user.findUnique({
          select: {
              id: true,
              name: true,
              email: true,
              image: true,
              accounts: {
                select: {
                  userId: true
                }
              },
              user_role: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            role_permission: {
                              select: {
                                  permission: {
                                      select: {
                                          id: true,
                                          name: true,
                                          description: true
                                      }
                                  }
                              }
                            }
                        }
                    }
                }
              }
          },      
          where: {
            id: req.auth.user.id,
          },
      });
  
      if (profile) {
        const account = (profile?.accounts && profile?.accounts.length) ? profile.accounts : []
        profile = { id: profile.id, name: profile.name, email: profile.email, image: profile.image, user_role: profile.user_role } as any
        return Response.json({ profile : profile, account: (account && account.length) ? true : false })
      } else {
        return Response.json({ error: "Profile not found" }, { status: 400 })
      } 
    } catch (err) {
        return Response.json({ error: "Could not retrieve profile" }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const PUT = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'profileUpdate')
  if (req.auth && isAuthorized) {
    const data = await req.json();
    if (data.password && data.password_confirm) {
      if (data.password != data.password_confirm) {
        return Response.json({ error: "Password & Password Confirm don't match" }, { status: 400 })
      }
    }
    try {
        let profile = await prisma.user.findUnique({
          where: {
            id: req.auth.user.id,
          },
        });
        if (profile) {
            if (data.password && data.password_confirm) {
              profile.salt = (profile.salt) ? profile.salt : Math.round((new Date().valueOf() * Math.random())) + ''
              profile.hashed_password = crypto
                .createHmac('sha1', profile.salt)
                .update(data.password)
                .digest('hex')
            }
            profile = await prisma.user.update({
              where: {
                  id: req.auth.user.id,
              },
              data: {
                  name: data.name,
                  email: data.email,
                  updated: moment().toDate(),
                  salt: (data.password && data.password_confirm) ? profile.salt : undefined,
                  hashed_password: (data.password && data.password_confirm) ? profile.hashed_password : undefined,
              },
            })

            profile = { id: profile.id, name: profile.name, email: profile.email, image: profile.image } as any
        } else {
            return Response.json({ error: "Profile not found" }, { status: 400 })
        }
        return Response.json(profile)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any

export const DELETE = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'profileDelete')
  if (req.auth && isAuthorized) {
    try {
        let deletedProfile = await prisma.user.delete({
            where: {
              id: req.auth.user.id,
            },
        })  
        if (deletedProfile) {
          deletedProfile = { id: deletedProfile.id, name: deletedProfile.name, email: deletedProfile.email, image: deletedProfile.image } as any
        }
        return Response.json(deletedProfile)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }  
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any