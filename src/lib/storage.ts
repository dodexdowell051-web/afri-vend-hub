import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadProductImage = async (file: File, userId: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) {
    toast.error("Failed to upload image");
    return null;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const uploadStoreLogo = async (file: File, userId: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('store-logos')
    .upload(fileName, file);

  if (error) {
    toast.error("Failed to upload logo");
    return null;
  }

  const { data } = supabase.storage
    .from('store-logos')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
