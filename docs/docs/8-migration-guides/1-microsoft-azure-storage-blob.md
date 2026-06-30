---
sidebar_position: 1
slug: /migration-guides/microsoft-azure-storage-blob
title: Migrate from microsoft/azure-storage-blob
description: Move from the deprecated Microsoft Azure Blob SDK for PHP to azure-oss/storage-blob.
---

`azure-oss/storage-blob` is the replacement package for `microsoft/azure-storage-blob`.

If your current code is built on `BlobRestProxy`, the main migration is:

- package name change
- service client API change
- updated auth model
- opportunity to adopt newer Blob features and docs

## Detailed comparison

| Area | `microsoft/azure-storage-blob` | `azure-oss/storage-blob` |
| --- | --- | --- |
| Primary client | `BlobRestProxy` | `BlobServiceClient`, `BlobContainerClient`, `BlobClient` |
| PHP target | PHP `>=5.6` | PHP `^8.2` |
| Auth model | Connection strings, SAS endpoints, token credential entry point | Connection strings, shared key, SAS auth, Microsoft Entra ID via `azure-oss/identity` |
| Blob feature emphasis | Containers, block/page blobs, metadata, leases, snapshots | Containers, metadata, leases, tags, versions, snapshots, soft delete restore, hierarchical listing, SAS builders |
| Local development | Older SDK guidance | Explicit Azurite support in the current docs |
| Package direction | Deprecated legacy line | Current community-maintained line |

## What changes in code

The legacy SDK creates a single proxy:

```php
use MicrosoftAzure\Storage\Blob\BlobRestProxy;

$blobClient = BlobRestProxy::createBlobService($connectionString);
```

The new SDK starts with a service client and then narrows to a container or blob:

```php
use AzureOss\Storage\Blob\BlobServiceClient;

$service = BlobServiceClient::fromConnectionString($connectionString);
$container = $service->getContainerClient('documents');
$blob = $container->getBlobClient('report.pdf');
```

That hierarchy is the biggest conceptual change in the migration.

## Migration steps

### 1. Replace the package

```bash
composer remove microsoft/azure-storage-blob
composer require azure-oss/storage-blob
```

### 2. Replace `BlobRestProxy`

Common mapping:

- `BlobRestProxy` -> `BlobServiceClient`
- container name arguments used repeatedly in method calls -> `BlobContainerClient`
- blob name arguments used repeatedly in method calls -> `BlobClient`

### 3. Move repeated container and blob names into clients

Old style:

```php
$blobClient->createBlockBlob($containerName, $blobName, $contents);
```

New style:

```php
$service = BlobServiceClient::fromConnectionString($connectionString);
$container = $service->getContainerClient($containerName);
$blob = $container->getBlobClient($blobName);

$blob->upload($contents);
```

### 4. Choose the right auth path

Stay with connection strings if you want the lowest-risk migration first.

Move to token-based auth later if you want:

- Microsoft Entra ID
- workload identity
- managed identity

See [Blob installation](../2-storage-blob/1-installation.md) and [Microsoft Entra ID](../2-storage-blob/3-authorize/1-entra.md).

### 5. Re-test SAS behavior

If your app generates signed URLs, verify:

- blob SAS URLs
- container SAS URLs
- any account-level SAS workflows
- snapshot- or version-specific links if you adopt those features

## What gets better after migrating

- Clearer client boundaries between service, container, and blob operations
- First-class docs for tags, versions, hierarchical listing, leases, and SAS generation
- Modern auth story aligned with `azure-oss/identity`
- Better alignment with the Flysystem and Laravel packages in this ecosystem
- Azurite-friendly local development story

## Migration checklist

- Replace `BlobRestProxy` imports
- Replace service calls with service/container/blob clients
- Re-test uploads, downloads, deletes, list operations, and metadata writes
- Re-test signed URL generation
- Re-test any token-based auth path separately from shared key auth

## Next docs

- [Blob overview](../2-storage-blob/0-overview.md)
- [Blob installation](../2-storage-blob/1-installation.md)
- [Blob quickstart](../2-storage-blob/2-quickstart.md)
- [What to use after microsoft/azure-storage-blob](../9-blog/1-what-to-use-after-microsoft-azure-storage-blob.md)
