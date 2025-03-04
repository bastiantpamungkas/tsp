import { auth } from "@/src/auth"
import moment from "moment"
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

export const GET = auth(async (req) => {
  const isAuthorized = await checkPermission(req.auth, 'workorders')
  if (req.auth && isAuthorized) {
    try {
      const start_date = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
      const end_date = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
  
      let total = await prisma.workorder.count({
        where: {
          created: { 
            gte: new Date(start_date), 
            lte: new Date(end_date) 
          }
        }
      })
      const qty = await prisma.workorder.aggregate({
        _sum: {
          qty: true
        },
        where: {
          created: { 
            gte: new Date(start_date), 
            lte: new Date(end_date) 
          }
        }
      })
      const workorders = await prisma.workorder.findMany({
          include: {
            product: true
          }
      })
        
      const price = workorders.reduce((sum, workorder) => {
        return sum + workorder.product.price * workorder.qty
      }, 0)

      return Response.json({ count: total, qty: qty, price: price })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}) as any