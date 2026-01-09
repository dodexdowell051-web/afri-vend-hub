import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const { store } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!store) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch products");
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const addProduct = async (product: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
    category?: string;
  }) => {
    if (!store) return { error: new Error("No store found") };
    
    const { data, error } = await supabase
      .from("products")
      .insert({
        store_id: store.id,
        name: product.name,
        description: product.description || null,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url || null,
        category: product.category || null,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to add product");
      return { error };
    }
    
    setProducts(prev => [data as Product, ...prev]);
    toast.success("Product added successfully");
    return { error: null, data };
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to update product");
      return { error };
    }
    
    setProducts(prev => prev.map(p => p.id === id ? data as Product : p));
    toast.success("Product updated successfully");
    return { error: null, data };
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error("Failed to delete product");
      return { error };
    }
    
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted successfully");
    return { error: null };
  };

  useEffect(() => {
    if (store) {
      fetchProducts();
    }
  }, [store]);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
