/**
 * The public host of this site's Blob store, or null without one. Read from BLOB_READ_WRITE_TOKEN, which is
 * "vercel_blob_rw_<storeId>_<secret>", so there's nothing extra to configure and each environment gets its own store.
 */
export const blobStoreHost = (token = process.env.BLOB_READ_WRITE_TOKEN) => {
    const storeId = token?.split("_")[3];
    return storeId ? `${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
};
