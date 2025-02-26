import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadImageToSupabase(file: File) {
    try {
        const filePath = `uploads/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, file);

        if (error) {
            console.error("Image upload error:", error.message);
            return null;
        }

        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}
