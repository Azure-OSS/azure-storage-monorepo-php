---
sidebar_position: 4
slug: /migration-guides/microsoft-azure-storage-queue
title: Migrate from microsoft/azure-storage-queue
description: Move from the deprecated Microsoft Azure Queue SDK for PHP to azure-oss/storage-queue.
---

`azure-oss/storage-queue` replaces `microsoft/azure-storage-queue`.

Like the Blob migration, the main shift is from a single `*RestProxy` to a clearer client hierarchy.

## Detailed comparison

| Area | `microsoft/azure-storage-queue` | `azure-oss/storage-queue` |
| --- | --- | --- |
| Primary client | `QueueRestProxy` | `QueueServiceClient`, `QueueClient` |
| PHP target | PHP `>=5.6` | PHP `^8.2` |
| Auth model | Connection strings, SAS endpoints, token credential entry point | Connection strings, shared key, SAS auth, Microsoft Entra ID via `azure-oss/identity` |
| Queue operations | Queue CRUD and message CRUD | Queue CRUD, message send/receive/update/delete, clearer docs structure |
| Local development | Legacy SDK guidance | Explicit Azurite support in current docs |
| Package direction | Deprecated legacy line | Current community-maintained line |

## What changes in code

Legacy setup:

```php
use MicrosoftAzure\Storage\Queue\QueueRestProxy;

$queueClient = QueueRestProxy::createQueueService($connectionString);
```

New setup:

```php
use AzureOss\Storage\Queue\QueueServiceClient;

$service = QueueServiceClient::fromConnectionString($connectionString);
$queue = $service->getQueueClient('jobs');
```

Old queue operations often repeated the queue name in each call. The new package encourages a dedicated `QueueClient`.

## Migration steps

### 1. Replace the package

```bash
composer remove microsoft/azure-storage-queue
composer require azure-oss/storage-queue
```

### 2. Replace `QueueRestProxy`

Map:

- `QueueRestProxy` -> `QueueServiceClient`
- repeated queue name arguments -> `QueueClient`

### 3. Re-test message invisibility and TTL behavior

Verify:

- receive visibility timeout
- update visibility timeout
- message TTL assumptions
- worker concurrency assumptions in your application

### 4. Re-test auth separately from queue logic

If you move beyond connection strings, test the auth layer independently first:

- shared key
- SAS endpoint usage
- Microsoft Entra ID

## What gets better after migrating

- A cleaner service client and queue client model
- Docs aligned with the rest of the `azure-oss` ecosystem
- Modern auth integration via `azure-oss/identity`
- Better local development story with Azurite

## Next docs

- [Queue overview](../5-storage-queue/0-overview.md)
- [Queue installation](../5-storage-queue/1-installation.md)
- [Queue quickstart](../5-storage-queue/2-quickstart.md)
- [Modern Azure Queue for Laravel without squigg/azure-queue-laravel](../9-blog/4-modern-azure-queue-for-laravel.md)
