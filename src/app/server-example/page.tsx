import { auth } from "@/src/auth"
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '@/src/components/AppAppBar';
import SessionData from "@/src/components/session-data"
import Footer from '@/src/components/Footer';

export default async function Page() {
  const session = await auth()
  return (
    <>
      <AppAppBar />
      <Box sx={{
          bgcolor: 'background.default',
          pt: 15,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <Box sx={{ mt: 3, mb: 10, width: { md: '1024px' } }}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">React Server Component Usage</h1>
            <p>
              This page is server-rendered as a{" "}
              <NextLink href="https://nextjs.org/docs/app/building-your-application/rendering/server-components">
                React Server Component
              </NextLink>
              . It gets the session data on the server using{" "}
              <NextLink href="https://nextjs.authjs.dev#auth">
                <code>auth()</code>
              </NextLink>{" "}
              method.
            </p>
            <SessionData session={session} />
          </div>
        </Box>
        <Divider />
        <Footer />
      </Box>  
    </>
  )
}
