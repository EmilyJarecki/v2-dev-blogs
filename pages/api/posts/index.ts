import dbConnect from "@/lib/dbConnect";
import { NextApiHandler } from "next";
import Joi from "joi";
import { readFile } from "@/lib/utils";
import { postValidationSchema, validateSchema } from "@/lib/validator";
import Post from "@/models/Posts";
import formidable from "formidable";
import cloudinary from "@/lib/cloudinary";

export const config = {
    api: { bodyParser: false },
}

const handler: NextApiHandler = async (req, res) => {
    const { method } = req
    switch (method) {
        case "GET": {
            await dbConnect();
            res.json({ ok: true })
        }
        case "POST": return createNewPost(req, res)
    }
}

const createNewPost: NextApiHandler = async (req, res) => {
    const { files, body } = await readFile(req)

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)


    const error = validateSchema(postValidationSchema, { ...body, tags })
    if (error) return res.status(400).json({ error })

    const { title, content, slug, meta } = body

    await dbConnect()
    const alreadyExists = await Post.findOne({ slug })
    if (alreadyExists) return res.status(400).json({ error: "Slug needs to be unique" })

    //create new post
    const newPost = new Post({
        title,
        content,
        slug,
        meta,
        tags
    })

    //uploading thumbnail if there is any
    const thumbnail = files.thumbnail as formidable.File;
    if (thumbnail) {
        const { secure_url: url, public_id } = await cloudinary.uploader.
            upload(
                thumbnail.filepath,
                {
                    folder: "dev-blogs"
                })
        newPost.thumbnail = { url, public_id }
    }
    await newPost.save()

    res.json({ post: newPost })
}

export default handler;