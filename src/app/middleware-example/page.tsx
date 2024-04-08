import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default function Index() {
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Middleware usage</h1>
          <p>
            This page is protected by using the universal{" "}
            <NextLink href="https://nextjs.authjs.dev#auth">
              <code>auth()</code>
            </NextLink>{" "}
            method in{" "}
            <NextLink href="https://nextjs.org/docs/app/building-your-application/routing/middleware">
              Next.js Middleware
            </NextLink>
            .
          </p>
        </div>
        <Divider />
        <Footer />
      </Box>
    </>
  )
}


