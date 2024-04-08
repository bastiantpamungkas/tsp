import { auth, config } from "@/src/auth"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Inter } from "next/font/google"
import packageJSON from "next-auth/package.json"
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@/src/theme/ThemeProvider';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: packageJSON.description,
}

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await auth()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Layout UI */}
        <main>
          <SessionProvider basePath={config.basePath} session={session}>
            <ThemeProvider>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}
