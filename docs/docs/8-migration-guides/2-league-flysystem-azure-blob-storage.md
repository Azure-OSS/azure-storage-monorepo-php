---
sidebar_position: 2
slug: /migration-guides/league-flysystem-azure-blob-storage
title: Migrate from league/flysystem-azure-blob-storage
description: Move from the abandoned Flysystem Azure Blob adapter to azure-oss/storage-blob-flysystem.
---

`azure-oss/storage-blob-flysystem` replaces `league/flysystem-azure-blob-storage`.

This is usually the cleanest migration in the set because both packages target Flysystem v3. The main differences are the underlying Blob SDK and the constructor shape.

## Detailed comparison

| Area | `league/flysystem-azure-blob-storage` | `azure-oss/storage-blob-flysystem` |
| --- | --- | --- |
| Package status | Abandoned in favor of `azure-oss/storage-blob-flysystem` | Current package |
| Underlying SDK | `microsoft/azure-storage-blob` | `azure-oss/storage-blob` |
| Adapter namespace | `League\\Flysystem\\AzureBlobStorage\\AzureBlobStorageAdapter` | `AzureOss\\Storage\\BlobFlysystem\\AzureBlobStorageAdapter` |
| Constructor entry point | `BlobRestProxy` plus container name | `BlobContainerClient` |
| Temp URLs | Requires legacy service settings to sign | Uses the new Blob client's SAS capability |
| Public URL mode | URL generation via the legacy adapter | Built-in `isPublicContainer` behavior for direct public URLs |
| Upload config | Legacy adapter-specific options | Supports modern `httpHeaders`, transfer tuning, and conditional write config |

## What changes in code

Legacy setup:

```php
use League\Flysystem\AzureBlobStorage\AzureBlobStorageAdapter;
use League\Flysystem\Filesystem;
use MicrosoftAzure\Storage\Blob\BlobRestProxy;

$client = BlobRestProxy::createBlobService($connectionString);
$adapter = new AzureBlobStorageAdapter($client, 'documents');
$filesystem = new Filesystem($adapter);
```

New setup:

```php
use AzureOss\Storage\Blob\BlobServiceClient;
use AzureOss\Storage\BlobFlysystem\AzureBlobStorageAdapter;
use League\Flysystem\Filesystem;

$service = BlobServiceClient::fromConnectionString($connectionString);
$container = $service->getContainerClient('documents');
$adapter = new AzureBlobStorageAdapter($container);
$filesystem = new Filesystem($adapter);
```

## Migration steps

### 1. Replace the package

```bash
composer remove league/flysystem-azure-blob-storage
composer require azure-oss/storage-blob-flysystem
```

### 2. Update the namespace import

Replace:

```php
use League\Flysystem\AzureBlobStorage\AzureBlobStorageAdapter;
```

with:

```php
use AzureOss\Storage\BlobFlysystem\AzureBlobStorageAdapter;
```

### 3. Build a `BlobContainerClient`

The new adapter does not take a legacy `BlobRestProxy`. It takes a container client from `azure-oss/storage-blob`.

### 4. Re-check URL generation

If your old code relied on temporary URLs, test:

- `temporaryUrl()`
- `publicUrl()`
- public container behavior
- custom response header overrides in signed URLs

### 5. Re-check metadata and conditional writes

The new adapter exposes useful upload config inputs such as:

- `httpHeaders`
- `conditions`
- transfer sizing and concurrency values

That is a good moment to make previously implicit behavior explicit.

## What gets better after migrating

- A maintained adapter on top of the maintained Blob SDK
- Cleaner layering with `BlobContainerClient`
- Better alignment with the Laravel filesystem driver
- Built-in support for public-container URL generation and modern SAS handling
- More explicit write options for metadata, headers, and conditions

## Next docs

- [Flysystem installation](../3-storage-blob-flysystem/1-installation.md)
- [Flysystem quickstart](../3-storage-blob-flysystem/2-quickstart.md)
- [Migrating from league/flysystem-azure-blob-storage](../9-blog/2-migrating-from-league-flysystem-azure-blob-storage.md)
