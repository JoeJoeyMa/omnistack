export type StorageConfig = {
  bucketName: string;
  publicBaseUrl: string;
};

export function getStorageConfig(env: {
  R2_BUCKET_NAME?: string;
  R2_PUBLIC_BASE_URL?: string;
}): StorageConfig {
  return {
    bucketName: env.R2_BUCKET_NAME ?? "uploads",
    publicBaseUrl: env.R2_PUBLIC_BASE_URL ?? "http://localhost:8787",
  };
}
