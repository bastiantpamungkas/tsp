import { NextRequest } from "next/server"
import prisma from '@/src/lib/prismaClient'

export const GET = async (req: NextRequest) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
          <loc>${process.env.AUTH_URL}</loc>
          <lastmod>${new Date().toISOString().slice(0,10)}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.5</priority>
      </url>
    </urlset>`

    return new Response(xmlContent, { headers: { "Content-Type": "text/xml" } })
}