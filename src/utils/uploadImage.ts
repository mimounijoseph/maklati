const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kntciyxyvmecvqraxyse.supabase.co"
).replace(/\/$/, "");

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  "sb_publishable_Tva3TgDlTNRLnJ-Y-Z92Gg_ZhD8Wh4u";

const SUPABASE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "maklati";

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();

const buildPublicPrefix = () =>
  `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/`;

const getHeaders = (contentType?: string) => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  ...(contentType ? { "Content-Type": contentType } : {}),
});

const buildFilePath = (file: File, folder: string) => {
  const extension = file.name.split(".").pop() || "jpg";
  const baseName = file.name.replace(new RegExp(`\\.${extension}$`), "");
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${folder}/${uniquePart}-${sanitizeFileName(baseName)}.${extension}`;
};

const extractStoragePathFromUrl = (fileUrl: string) => {
  const prefix = buildPublicPrefix();
  if (!fileUrl.startsWith(prefix)) {
    return null;
  }

  return decodeURIComponent(fileUrl.slice(prefix.length));
};

export const uploadImageFile = async (file: File, folder: string) => {
  const filePath = buildFilePath(file, folder);
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${filePath}`,
    {
      method: "POST",
      headers: {
        ...getHeaders(file.type || "application/octet-stream"),
        "cache-control": "3600",
        "x-upsert": "true",
      },
      body: file,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      throw new Error(
        `Supabase bucket "${SUPABASE_BUCKET}" was not found. Create this public bucket in Supabase Storage or set NEXT_PUBLIC_SUPABASE_BUCKET to an existing bucket.`
      );
    }
    throw new Error(`Supabase upload failed: ${errorText}`);
  }

  return `${buildPublicPrefix()}${filePath}`;
};

export const deleteImageFileByUrl = async (fileUrl?: string | null) => {
  if (!fileUrl) return;

  const filePath = extractStoragePathFromUrl(fileUrl);
  if (!filePath) return;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${filePath}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase delete failed: ${errorText}`);
  }
};
