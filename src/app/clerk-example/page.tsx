"use client"
import { useState } from 'react';
import { useSession } from "next-auth/react"
import NextLink from 'next/link';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField'
import AppAppBar from '@/src/components/AppAppBar';
import Button from "@mui/material/Button"
import Footer from '@/src/components/Footer';

export default function Index() {
  const { data: session, status, update } = useSession()
  const [name, setName] = useState('')

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

            {status === "loading" ? (
              <div>Loading...</div>
            ) : (
              (session) &&
                <div className="flex flex-col gap-4 w-full">
                  <h2 className="text-xl font-bold">Current Session Data</h2>
                  {Object.keys(session.user).length > 3 ? (
                    <p>
                      In this example, the whole session object is passed to the page,
                      including the raw user object. Our recommendation is to{" "}
                      <em>only pass the necessary fields</em> to the page, as the raw user
                      object may contain sensitive information.
                    </p>
                  ) : (
                    <p>
                      In this example, only some fields in the user object is passed to
                      the page to avoid exposing sensitive information.
                    </p>
                  )}
                  <div className="flex flex-col rounded-md border">
                    <div className="p-4 font-bold rounded-t-md border">
                      Session
                    </div>
                    <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </div>
                </div>
            )}
            
            {
              (session) &&
                <>
                  <h2 className="text-xl font-bold">Updating the session</h2>
                  <Box
                    className="flex items-center space-x-2 w-full max-w-sm"
                  >
                    <TextField
                        autoComplete="name"
                        name="name"
                        id="name"
                        label="Name"
                        autoFocus
                        value={name} 
                        onChange={(e) => {
                          setName(e.target.value)
                        }}
                    />
                    <Button
                      variant='contained'
                      onClick={async () => {
                        if (session) {
                          const newSession = await update({
                            ...session,
                            user: { ...session.user, name },
                          })
                        }
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </>
            }
          </div>
        </Box>
        <Divider />
        <Footer />
      </Box>
    </ClerkProvider>
  )
}

