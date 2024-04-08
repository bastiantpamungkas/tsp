import type { Metadata } from "next"
import { Inter } from "next/font/google"
import packageJSON from "next-auth/package.json"
import SidebarLayout from '@/src/components/SidebarLayout';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: packageJSON.description,
}

export default async function AdminLayout({ children }: React.PropsWithChildren) {
  return (
    <SidebarLayout>
        {children}
    </SidebarLayout>
  )
}
