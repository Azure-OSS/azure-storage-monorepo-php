---
sidebar_position: 5
slug: /migration-guides/squigg-azure-queue-laravel
title: Migrate from squigg/azure-queue-laravel
description: Move from the older Laravel Azure Queue driver to azure-oss/storage-queue-laravel.
---

`azure-oss/storage-queue-laravel` replaces `squigg/azure-queue-laravel`.

This migration is mostly about config names, driver names, and aligning your queue integration with the new `azure-oss/storage-queue` SDK.

It also gives you a cleaner auth story: direct connection-string support, explicit shared key config, SAS-bearing connection strings, and custom endpoint support for local or emulator-style setups.

## Detailed comparison

| Area | `squigg/azure-queue-laravel` | `azure-oss/storage-queue-laravel` |
| --- | --- | --- |
| Driver name | `azure` | `azure-storage-queue` |
| Underlying SDK | `microsoft/azure-storage-queue` | `azure-oss/storage-queue` |
| Shared key config | `accountname`, `key` | `account_name`, `account_key` |
| Queue timeout field | `timeout` | `retry_after` |
| Connection string support | Manual connection string assembly from fields | Native `connection_string` support |
| Extra queue options | Basic connector config | `time_to_live`, `create_queue`, `after_commit` |
| Auth options | Shared key via account name and key | Connection string auth, shared key via account name and key, SAS-based auth via connection string |

## Config mapping

Old config:

```php
'azure' => [
    'driver' => 'azure',
    'protocol' => 'https',
    'accountname' => env('AZURE_QUEUE_STORAGE_NAME'),
    'key' => env('AZURE_QUEUE_KEY'),
    'queue' => env('AZURE_QUEUE_NAME'),
    'timeout' => 60,
    'endpoint' => env('AZURE_QUEUE_ENDPOINTSUFFIX'),
    'queue_endpoint' => env('AZURE_QUEUE_ENDPOINT'),
],
```

New config with explicit fields:

```php
'azure' => [
    'driver' => 'azure-storage-queue',
    'account_name' => env('AZURE_QUEUE_STORAGE_NAME'),
    'account_key' => env('AZURE_QUEUE_KEY'),
    'protocol' => 'https',
    'endpoint_suffix' => env('AZURE_QUEUE_ENDPOINTSUFFIX', 'core.windows.net'),
    'queue_endpoint' => env('AZURE_QUEUE_ENDPOINT'),
    'queue' => env('AZURE_QUEUE_NAME', 'default'),
    'retry_after' => 60,
    'time_to_live' => null,
    'create_queue' => false,
],
```

New config with a connection string:

```php
'azure' => [
    'driver' => 'azure-storage-queue',
    'connection_string' => env('AZURE_STORAGE_CONNECTION_STRING'),
    'queue' => env('AZURE_STORAGE_QUEUE', 'default'),
    'retry_after' => 60,
],
```

## Migration steps

### 1. Replace the package

```bash
composer remove squigg/azure-queue-laravel
composer require azure-oss/storage-queue-laravel
```

### 2. Change the driver name

Replace:

```php
'driver' => 'azure',
```

with:

```php
'driver' => 'azure-storage-queue',
```

### 3. Rename config fields

Map:

- `accountname` -> `account_name`
- `key` -> `account_key`
- `timeout` -> `retry_after`
- `endpoint` -> `endpoint_suffix`

### 4. Consider switching to a connection string

If your team already stores a storage connection string securely, the new connector supports using it directly. That usually makes config shorter and easier to copy between environments.

### 5. Re-test worker timing

The most important behavioral field is still the invisibility timeout. In Laravel terms, that is configured through `retry_after`.

Make sure `retry_after` is longer than the slowest real job you expect to run.

## What gets better after migrating

- Maintained Queue SDK underneath the Laravel connector
- Cleaner config names
- First-class connection string support
- Better support for shared key, SAS-bearing connection strings, and custom endpoint setups
- Better fit with modern Laravel queue expectations such as `after_commit`
- Optional queue creation during bootstrap flows

## Next docs

- [Laravel Queue installation](../6-storage-queue-laravel/1-installation.md)
- [Laravel Queue quickstart](../6-storage-queue-laravel/2-quickstart.md)
- [Modern Azure Queue for Laravel without squigg/azure-queue-laravel](../9-blog/4-modern-azure-queue-for-laravel.md)
