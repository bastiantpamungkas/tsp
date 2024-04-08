import { NextRequest } from "next/server"
import { auth } from "@/src/auth"
import getConfig from 'next/config'
import cloudinary from 'cloudinary';
import path from 'path';
import { extname, join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import mime from "mime-types";
import fs from 'fs'
import { unlink } from 'fs';
import moment from 'moment'
import prisma from '@/src/lib/prismaClient'
import checkPermission from '@/src/lib/authorize'

export const POST = async (req: NextRequest) => {
  const session = await auth()
  const isAuthorized = await checkPermission(session, 'profileUpdate')
  if (session && isAuthorized) {
    let profile = await prisma.user.findUnique({    
        where: {
          id: session.user.id,
        },
    });
    if (profile) {
        const formData = await req.formData();
        const file = <any>formData.get("photo");
        const fileSize = file?.size ?? 0
        const fileExtension = mime.extension(file?.type ?? '')
        if (!file) {
            return Response.json({ error: "File blob is required." }, { status: 400 })
        }
        if (fileSize >= (2 * 1024 * 1024)) {
            return Response.json({ error: "Maximum file size" }, { status: 400 })
        }
        if(fileExtension == 'png'||  fileExtension == 'jpg' || fileExtension == 'jpeg') {
            const buffer = Buffer.from(await file.arrayBuffer())
            let uploadDir: string = ''
            if (process.env.CLOUDINARY_URL) {
                uploadDir = "/tmp/profile-photos"
            } else {
                uploadDir = join(getConfig().serverRuntimeConfig.PROJECT_ROOT, "/public/upload/profile-photos")
            }
            
            try {
                await stat(uploadDir);
            } catch (error: any) {
                if (error.code === "ENOENT") {
                    await mkdir(uploadDir, { recursive: true });
                } else {
                    console.error("Error while trying to create directory when uploading a file\n", error);
                    return Response.json({ error: "Something went wrong." }, { status: 400 })
                }
            }

            try {
                const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`
                const originalFilename = file.name.replace(/\.[^/.]+$/, "")
                const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9_\u0600-\u06FF.]/g, "_")              ;
                const filename = `${sanitizedFilename}_${uniqueSuffix}.${fileExtension}`
                let image = ''
                if (process.env.CLOUDINARY_URL) {
                    // use cloudinary storage
                    if (profile && profile.image) {
                        const public_id = 'profile-photos/' + path.parse(profile.image).name
                        await cloudinary.v2.uploader.destroy(public_id);
                    }
                    await writeFile(`${uploadDir}/${filename}`, buffer);
                    await cloudinary.v2.uploader.upload(`${uploadDir}/${filename}`, { folder: "profile-photos" }, 
                    async function(err, result) {
                        if (fs.existsSync(`${uploadDir}/${filename}`)) {
                            await unlink(`${uploadDir}/${filename}`, async (err) => {})
                        }
                        image = (result && result.secure_url) ? result.secure_url : ''
                    });
                } else {
                    if (profile && profile.image) {
                        if (fs.existsSync(getConfig().serverRuntimeConfig.PROJECT_ROOT + '/public' + profile.image)) {
                          await unlink(getConfig().serverRuntimeConfig.PROJECT_ROOT + '/public' + profile.image, async (err) => {})
                        }
                    }
                    await writeFile(`${uploadDir}/${filename}`, buffer);
                    image = (filename) ? ('/upload/profile-photos/' + filename) : ''
                }
                profile = await prisma.user.update({
                    where: {
                        id: session.user.id,
                    },
                    data: {
                        image: (image) ? image : undefined,
                        updated: moment().toDate(),
                    },
                })
                profile = { id: profile.id, name: profile.name, email: profile.email, image: profile.image } as any
                return Response.json({ message: "Successfully updated photo", profile}) 
            } catch (error) {
                console.error("Error while trying to upload a file\n", error);
                return Response.json({ error: "Something went wrong." }, { status: 400 })
            }
        } else {
            return Response.json({ error: "file not allowed (only for png, jpg, or jpeg)" }, { status: 400 })
        }
    } else {
        return Response.json({ error: "Profile not found" }, { status: 400 })
    }
  } else {
    return Response.json({ error: "Not authenticated" }, { status: 400 })
  }
}