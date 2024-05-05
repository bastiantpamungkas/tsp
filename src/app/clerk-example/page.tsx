"use client"
import NextLink from 'next/link';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default function Index() {
  return (
    <ClerkProvider>
      <AppAppBar />
      <Box sx={{
          bgcolor: 'background.default',
          pt: 15,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <Box sx={{ width: { md: '1024px' } }}>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Clerk Example</h1>
            <p>
              This page an example how to use clerk in next Js {" "}
              <NextLink href="https://clerk.com/docs/quickstarts/nextjs">
                <code>ClerkProvider</code>
              </NextLink>{" "}
              Clerk Provider.
            </p>
            <p>
              <NextLink href="https://clerk.com/docs/quickstarts/nextjs">
                <code>ClerkProvider</code>
              </NextLink>{" "}
              component in{" "}
              <strong>
                <code>clerk-example/page.tsx</code>
              </strong>{" "}
              to provide the session data.
            </p>

            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Box>
        <Divider />
        <Footer />
      </Box>
    </ClerkProvider>
  )
}

