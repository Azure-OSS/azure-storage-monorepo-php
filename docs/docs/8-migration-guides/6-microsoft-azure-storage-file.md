---
sidebar_position: 6
slug: /migration-guides/microsoft-azure-storage-file
title: Migrate from microsoft/azure-storage-file
description: Compare the legacy Azure Files SDK for PHP with azure-oss/storage-file-share and choose the right migration path.
---

`azure-oss/storage-file-share` is the successor package to watch if you are moving away from `microsoft/azure-storage-file`, but it is important to set expectations clearly.

This is not yet the same kind of one-step replacement as the Blob and Queue migrations.

## Detailed comparison

| Area | `microsoft/azure-storage-file` | `azure-oss/storage-file-share` |
| --- | --- | --- |
| Primary client | `FileRestProxy` | `ShareServiceClient`, `ShareClient`, `ShareDirectoryClient`, `ShareFileClient` |
| PHP target | PHP `>=5.6` | PHP `^8.2` |
| Documented focus | Share, directory, and file CRUD | Azure Files service access patterns and SAS generation |
| Auth model | Connection strings and SAS endpoints | Connection strings, shared key, SAS auth, token credential-aware clients |
| Current replacement status | Legacy SDK | Partial replacement today |

## The important decision first

Before migrating, decide which category your application falls into.

### Category 1: You mainly need SAS URLs

This is the best fit for `azure-oss/storage-file-share` today.

The package already documents and supports:

- share clients
- directory clients
- file clients
- share and file SAS generation

### Category 2: You really need normal filesystem-style I/O

If your app is doing ordinary Azure Files work such as:

- creating and deleting directories
- reading and writing files through normal file APIs
- renaming paths
- treating the share like mounted storage

then the right migration target may be an Azure Files mount over SMB or NFS rather than a PHP SDK abstraction.

See the [File Share overview](../7-storage-file-share/0-overview.md) for that distinction.

### Category 3: You depend on older SDK-driven file CRUD

If your current code uses `FileRestProxy` heavily for service-side share, directory, and file operations, do a gap review before migrating.

Today the public `azure-oss/storage-file-share` docs are intentionally focused on SAS generation and service access patterns, not on claiming full CRUD parity with the old Microsoft package.

## Migration path for SAS-oriented workloads

### 1. Replace the package

```bash
composer remove microsoft/azure-storage-file
composer require azure-oss/storage-file-share
```

### 2. Replace `FileRestProxy`

Old style:

```php
use MicrosoftAzure\Storage\File\FileRestProxy;

$fileClient = FileRestProxy::createFileService($connectionString);
```

New style:

```php
use AzureOss\Storage\File\Share\ShareServiceClient;

$service = ShareServiceClient::fromConnectionString($connectionString);
$file = $service
    ->getShareClient('documents')
    ->getDirectoryClient('reports')
    ->getFileClient('summary.txt');
```

### 3. Rebuild SAS generation around the new clients

```php
use AzureOss\Storage\File\Share\Sas\ShareFileSasPermissions;
use AzureOss\Storage\File\Share\Sas\ShareSasBuilder;

$sasUri = $file->generateSasUri(
    ShareSasBuilder::new()
        ->setPermissions(new ShareFileSasPermissions(read: true))
        ->setExpiresOn(new DateTimeImmutable('+15 minutes')),
);
```

## What is already better

- A modern PHP baseline
- Client types that match Blob and Queue naming more closely
- First-class SAS generation documentation for Azure Files
- Better alignment with the rest of the `azure-oss` project

## What to validate before promising a migration

- Whether you only need SAS URLs or broader file operations
- Whether a mounted share is actually the simpler and more Azure-native design
- Whether your old `FileRestProxy` usage depends on API areas not yet documented in the new package

## Next docs

- [File Share overview](../7-storage-file-share/0-overview.md)
- [File Share installation](../7-storage-file-share/1-installation.md)
- [Generating SAS URLs](../7-storage-file-share/2-generating-sas-urls.md)
- [Azure File Share for PHP after microsoft/azure-storage-file](../9-blog/5-azure-file-share-after-microsoft-azure-storage-file.md)
