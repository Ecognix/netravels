import { createClient } from "./supabase/server";

export const samplePrices = {
  "meghalaya-cloud-trails": 18900, "assam-river-and-wild": 22500,
  "sikkim-mountains-and-monasteries": 24900, "arunachal-tawang-journey": 32900,
  "nagaland-culture-and-hills": 19900, "arunachal-ziro-valley": 23900,
};
export const formatPrice = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export async function getPrices() {
  const supabase = await createClient();
  if (!supabase) return { prices: samplePrices, samples: Object.keys(samplePrices), error: false };
  const { data, error } = await supabase.from("package_prices").select("slug, price_inr, is_sample");
  if (error || !data || Object.keys(samplePrices).some((slug) => !data.some((row) => row.slug === slug))) {
    console.error("Could not load package prices:", error?.message || "A package price is missing");
    return { prices: {}, samples: [], error: true };
  }
  return { prices: Object.fromEntries(data.map((row) => [row.slug, row.price_inr])), samples: data.filter((row) => row.is_sample).map((row) => row.slug), error: false };
}
