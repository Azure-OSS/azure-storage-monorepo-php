---
sidebar_position: 0
slug: /migration-guides
title: Migration Guides Overview
description: Compare deprecated Azure PHP packages with the azure-oss replacements and choose the right migration path.
---

These guides are for teams moving away from older Azure PHP packages toward the community-maintained `azure-oss` ecosystem.

They are intentionally practical:

- They compare the legacy package and the replacement package directly.
- They call out config and code changes that affect real upgrades.
- They are honest about where a package is already a strong replacement and where it is still early.

## Replacement matrix

| Legacy package | Replacement | Replacement level | Best starting point |
| --- | --- | --- | --- |
| `microsoft/azure-storage-blob` | `azure-oss/storage-blob` | Direct replacement for Blob SDK work | [Migrate from microsoft/azure-storage-blob](./1-microsoft-azure-storage-blob.md) |
| `league/flysystem-azure-blob-storage` | `azure-oss/storage-blob-flysystem` | Direct replacement for Flysystem v3 | [Migrate from league/flysystem-azure-blob-storage](./2-league-flysystem-azure-blob-storage.md) |
| `matthewbdaly/laravel-azure-storage` | `azure-oss/storage-blob-laravel` | Direct replacement for Laravel filesystem use | [Migrate from matthewbdaly/laravel-azure-storage](./3-matthewbdaly-laravel-azure-storage.md) |
| `microsoft/azure-storage-queue` | `azure-oss/storage-queue` | Direct replacement for Queue SDK work | [Migrate from microsoft/azure-storage-queue](./4-microsoft-azure-storage-queue.md) |
| `squigg/azure-queue-laravel` | `azure-oss/storage-queue-laravel` | Direct replacement for Laravel queue use | [Migrate from squigg/azure-queue-laravel](./5-squigg-azure-queue-laravel.md) |
| `microsoft/azure-storage-file` | `azure-oss/storage-file-share` | Partial replacement today | [Migrate from microsoft/azure-storage-file](./6-microsoft-azure-storage-file.md) |

## Detailed comparison

### Maintenance and package direction

The main split in this ecosystem is not just old versus new. It is also:

- Legacy Microsoft SDK packages built around `*RestProxy` clients
- Ecosystem integrations that still depend on those legacy Microsoft SDK packages
- `azure-oss` packages that align Blob, Queue, File Share, Laravel, Flysystem, and Identity under one actively maintained PHP codebase

That distinction matters because some wrappers are still installable, but they are still anchored to abandoned or retired storage SDKs underneath.

### Runtime support

The legacy Microsoft storage packages target PHP 5.6+.

The `azure-oss` packages target modern PHP:

- `azure-oss/storage-blob`: PHP `^8.2`
- `azure-oss/storage-queue`: PHP `^8.2`
- `azure-oss/storage-file-share`: PHP `^8.2`
- `azure-oss/storage-blob-flysystem`: PHP `^8.2`
- `azure-oss/storage-blob-laravel`: Laravel 10, 11, 12, and 13
- `azure-oss/storage-queue-laravel`: Laravel 10, 11, 12, and 13

That means migration is usually part of a broader modernization effort, not just a package rename.

### Authentication and local development

The strongest auth improvements are in the Blob side of the ecosystem:

- `azure-oss/storage-blob` and `azure-oss/storage-blob-laravel` support shared key, SAS auth, and Microsoft Entra ID flows through `azure-oss/identity`
- The Laravel Blob driver supports `client_secret`, `client_certificate`, `workload_identity`, and `managed_identity`
- Blob and Queue docs both include Azurite guidance for local development

The Laravel Queue connector already supports the main Azure Queue authentication shapes most Laravel apps use today:

- shared key via connection string
- shared key via `account_name` and `account_key`
- SAS-based auth when the connection string contains a shared access signature
- custom queue endpoints for local development and emulator-style setups

The Laravel Blob driver still exposes a broader credential matrix, but the Queue Laravel driver already covers the common connection-string and key-based deployment paths.

### API shape

The legacy Microsoft SDKs are centered on service-wide proxy classes:

- `BlobRestProxy`
- `QueueRestProxy`
- `FileRestProxy`

The `azure-oss` packages use a more focused client hierarchy:

- Blob: `BlobServiceClient` -> `BlobContainerClient` -> `BlobClient`
- Queue: `QueueServiceClient` -> `QueueClient`
- File Share: `ShareServiceClient` -> `ShareClient` -> `ShareDirectoryClient` / `ShareFileClient`

That usually makes the new code more explicit, but it also means migrations are not pure namespace changes.

### Ecosystem integrations

The new integrations are designed to fit together:

- Blob SDK and Flysystem adapter share the same Blob client model
- Laravel filesystem builds on the Flysystem adapter
- Laravel queue builds on the Queue SDK
- Shared auth, HTTP, SAS, and API-version behavior live in `azure-oss/storage-common`

That gives the new ecosystem a more coherent maintenance story than mixing packages from different maintainers and eras.

### Important File Share caveat

`azure-oss/storage-file-share` should not be described as a drop-in replacement for every `microsoft/azure-storage-file` scenario yet.

Today its public documentation is centered on Azure Files SAS generation and service access patterns. If your old code relies heavily on SDK-driven share, directory, and file CRUD, review the [File Share migration guide](./6-microsoft-azure-storage-file.md) before promising a one-step swap.

## Start with the guide that matches your current package

- Blob SDK: [Migrate from microsoft/azure-storage-blob](./1-microsoft-azure-storage-blob.md)
- Flysystem adapter: [Migrate from league/flysystem-azure-blob-storage](./2-league-flysystem-azure-blob-storage.md)
- Laravel filesystem: [Migrate from matthewbdaly/laravel-azure-storage](./3-matthewbdaly-laravel-azure-storage.md)
- Queue SDK: [Migrate from microsoft/azure-storage-queue](./4-microsoft-azure-storage-queue.md)
- Laravel queue: [Migrate from squigg/azure-queue-laravel](./5-squigg-azure-queue-laravel.md)
- File Share SDK: [Migrate from microsoft/azure-storage-file](./6-microsoft-azure-storage-file.md)

If you want the higher-level “why migrate now?” version first, start with the pages in [Blog](../9-blog/1-what-to-use-after-microsoft-azure-storage-blob.md).
