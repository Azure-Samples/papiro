// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

const storageAccountKey = process.env.STORAGE_ACCOUNT_KEY || '';
const storageAccount = process.env.STORAGE_ACCOUNT_NAME || '';
const storageAccountUrl = `https://${storageAccount}.blob.core.windows.net`;

export function getBlobServiceClient(): BlobServiceClient {
  const certificates = new StorageSharedKeyCredential(storageAccount, storageAccountKey);
  return new BlobServiceClient(storageAccountUrl, certificates);
}

export const SOURCE_CONTAINER_NAME = 'source';
export const TARGET_CONTAINER_NAME = 'target';
