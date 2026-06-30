---
sidebar_position: 3
slug: /migration-guides/matthewbdaly-laravel-azure-storage
title: Migrate from matthewbdaly/laravel-azure-storage
description: Move from the older Laravel Azure Blob driver to azure-oss/storage-blob-laravel.
---

`azure-oss/storage-blob-laravel` replaces `matthewbdaly/laravel-azure-storage`.

This migration is mostly about config and driver names, but it also unlocks a much stronger authentication story.

## Detailed comparison

| Area | `matthewbdaly/laravel-azure-storage` | `azure-oss/storage-blob-laravel` |
| --- | --- | --- |
| Driver name | `azure` | `azure-storage-blob` |
| Underlying adapter | `league/flysystem-azure-blob-storage` | `azure-oss/storage-blob-flysystem` |
| PHP/Laravel target | Older Laravel line | Laravel 10, 11, 12, and 13 on PHP `^8.2` |
| Shared key config | `name`, `key`, `container` | `connection_string` or `account_name` + `account_key` |
| SAS auth config | `sasToken` plus `endpoint` | SAS auth through connection strings |
| Token-based auth | Not a first-class feature | `client_secret`, `client_certificate`, `workload_identity`, `managed_identity` |
| URL behavior | `url` for `Storage::url()` | `url`, `temporary_url`, `is_public_container`, temporary URL support tied to SAS capability |
| HTTP options | Legacy retry middleware hook | Modern timeout and SSL verification options on the SDK client |

## Config mapping

Typical old config:

```php
'azure' => [
    'driver' => 'azure',
    'name' => env('AZURE_STORAGE_NAME'),
    'key' => env('AZURE_STORAGE_KEY'),
    'container' => env('AZURE_STORAGE_CONTAINER'),
    'url' => env('AZURE_STORAGE_URL'),
    'prefix' => null,
    'connection_string' => env('AZURE_STORAGE_CONNECTION_STRING'),
],
```

Typical new config:

```php
'azure' => [
    'driver' => 'azure-storage-blob',
    'connection_string' => env('AZURE_STORAGE_CONNECTION_STRING'),
    'container' => env('AZURE_STORAGE_CONTAINER'),
    'url' => env('AZURE_STORAGE_URL'),
],
```

Shared-key without a connection string:

```php
'azure' => [
    'driver' => 'azure-storage-blob',
    'credential' => 'shared_key',
    'account_name' => env('AZURE_STORAGE_ACCOUNT_NAME'),
    'account_key' => env('AZURE_STORAGE_ACCOUNT_KEY'),
    'container' => env('AZURE_STORAGE_CONTAINER'),
],
```

## Migration steps

### 1. Replace the package

```bash
composer remove matthewbdaly/laravel-azure-storage
composer require azure-oss/storage-blob-laravel
```

### 2. Change the driver name

Replace:

```php
'driver' => 'azure',
```

with:

```php
'driver' => 'azure-storage-blob',
```

### 3. Rename shared-key config fields

Map:

- `name` -> `account_name`
- `key` -> `account_key`
- `sasToken` -> use a SAS-based `connection_string` instead

### 4. Keep the first migration small

If you are upgrading a production Laravel app, use `connection_string` first. It is usually the least disruptive path.

After that, decide whether to move to:

- `shared_key`
- `client_secret`
- `client_certificate`
- `workload_identity`
- `managed_identity`

### 5. Re-test URL behavior

Especially verify:

- `Storage::url()`
- `Storage::temporaryUrl()`
- public container behavior
- custom `temporary_url` origin behavior

## What gets better after migrating

- Direct alignment with the maintained Blob SDK and Flysystem adapter
- Modern token-based auth options for Azure-hosted workloads
- Better support for custom origins and Azure Front Door style setups
- Better fit with modern Laravel versions
- Cleaner separation between public URLs and signed temporary URLs

## Next docs

- [Laravel Blob installation](../4-storage-blob-laravel/1-installation.md)
- [Laravel Blob quickstart](../4-storage-blob-laravel/2-quickstart.md)
- [Laravel Azure Blob Storage after matthewbdaly/laravel-azure-storage](../9-blog/3-laravel-azure-blob-storage-after-matthewbdaly.md)
