import { defineQuery } from "next-sanity";

const IMG = `{ "url": asset->url, "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const PRODUCT = `{
  _id, name, "slug": slug.current, price,
  "category": category->{ title, "slug": slug.current },
  "collection": collection->{ title, "slug": slug.current },
  "images": coalesce(images[]${IMG}, []),
  "sizes": coalesce(sizes[]{ label, "inStock": coalesce(inStock, false) }, []),
  "colours": coalesce(colours[]{ name, hex }, []),
  description,
  "featured": coalesce(featured, false),
  "newDrop": coalesce(newDrop, false)
}`;

const STORY = `{
  _id, title, "slug": slug.current, season, intro,
  "cover": cover${IMG},
  "slides": coalesce(slides[]{ "image": image${IMG}, caption }, [])
}`;

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  whatsappNumber, "currencyCode": coalesce(currencyCode, "USD"), "currencySymbol": coalesce(currencySymbol, "$"),
  instagramUrl, "heroImage": heroImage${IMG}, announcement, address, mapUrl, hours
}`);
export const BRANCHES_QUERY = defineQuery(`*[_type == "branch"] | order(coalesce(isMain, false) desc, name asc){
  _id, name, city, address, "lat": location.lat, "lng": location.lng, phone, whatsappNumber, hours, "isMain": coalesce(isMain, false)
}`);
export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(order asc){ _id, title, "slug": slug.current, order }`);
export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"
  && (!defined($category) || category->slug.current == $category)
  && (!defined($featured) || featured == $featured)
  && (!defined($newDrop) || newDrop == $newDrop)] | order(_createdAt desc)${PRODUCT}`);
export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]${PRODUCT}`);
export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[_type == "product" && _id in $ids]${PRODUCT}`);
export const STORIES_QUERY = defineQuery(`*[_type == "lookbookStory"] | order(_createdAt desc)${STORY}`);
export const STORY_QUERY = defineQuery(`*[_type == "lookbookStory" && slug.current == $slug][0]${STORY}`);
