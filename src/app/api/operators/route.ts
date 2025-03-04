import { auth } from "@/src/auth"
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'operators')
  if (req.auth && isAuthorized) {
    try {
      const offset = (req.nextUrl.searchParams.get('offset')) ? Number(req.nextUrl.searchParams.get('offset')) : 0
      const limit = (req.nextUrl.searchParams.get('limit')) ? Number(req.nextUrl.searchParams.get('limit')) : 100
      const column = (req.nextUrl.searchParams.get('column')) ? <string>req.nextUrl.searchParams.get('column') : 'id'
      const dir = (req.nextUrl.searchParams.get('dir')) ? req.nextUrl.searchParams.get('dir') : 'desc'
      let sort = <any>{}
      sort[column] = dir
  
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
        where: {
          user_role: {
            some: {
              role: {
                name: 'Operator'
              }
            }
          }
        }, 
        skip: (limit >= 0 ) ? offset : undefined, 
        take: (limit >= 0 ) ? limit : undefined, 
        orderBy: [sort]
      })
      return Response.json({ rows: users })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any