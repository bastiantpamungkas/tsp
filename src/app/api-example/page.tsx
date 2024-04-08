"use client"
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState()

  const handleApi = async () => {
    const res = await fetch("/api/protected")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => {
    handleApi()
  }, []);

  return (
    (!loading) ? (
      <>
        <AppAppBar />
        <Box sx={{
            bgcolor: 'background.default' ,
            pt: 15,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Route Handler Usage</h1>
            <p>
              This page fetches data from an API{" "}
              <NextLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
                Route Handler
              </NextLink>
              . The API is protected using the universal{" "}
              <NextLink href="https://nextjs.authjs.dev#auth">
                <code>auth()</code>
              </NextLink>{" "}
              method.
            </p>
            <div className="flex flex-col rounded-md border">
              <div className="p-4 font-bold rounded-t-md border">
                Data from API Route
              </div>
              <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
          
          <Divider />
          <Footer />
        </Box>
      </>
    ) : (<></>)
  )
}

