import { getUserData } from "@/lib/utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1MB",
      maxFileCount: 4,
    },
  })
    .middleware(async ({ req }) => {
      const {user} = await getUserData();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),

    pdfUploader: f({
      pdf: {
        maxFileSize: "4MB", 
        maxFileCount: 1,
      },
    })
      .middleware(async ({ req }) => {
        const { user } = await getUserData();
        if (!user) throw new UploadThingError("Unauthorized");
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        console.log("PDF upload complete for userId:", metadata.userId);
        console.log("File URL:", file.url);
        return { uploadedBy: metadata.userId };
      }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
