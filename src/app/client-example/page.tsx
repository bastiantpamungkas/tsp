"use client"
import { useState } from 'react';
import { useSession } from "next-auth/react"
import NextLink from 'next/link';
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
        <Box sx={{ width: { md: '1024px' } }}>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Client Side Rendering</h1>
            <p>
              This page fetches session data client side using the{" "}
              <NextLink href="https://nextjs.authjs.dev/react#usesession">
                <code>useSession</code>
              </NextLink>{" "}
              React Hook.
            </p>
            <p>
              It needs the{" "}
              <NextLink href="https://react.devreference/nextjs/react/use-client">
                <code>'use client'</code>
              </NextLink>{" "}
              directive at the top of the file to enable client side rendering, and
              the{" "}
              <NextLink href="https://nextjs.authjs.dev/react#sessionprovider">
                <code>SessionProvider</code>
              </NextLink>{" "}
              component in{" "}
              <strong>
                <code>client-example/page.tsx</code>
              </strong>{" "}
              to provide the session data.
            </p>

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
    </>
  )
}

