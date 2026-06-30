---
sidebar_position: 3
slug: /blog/laravel-azure-blob-storage-after-matthewbdaly-laravel-azure-storage
title: Laravel Azure Blob Storage after matthewbdaly/laravel-azure-storage
description: What Laravel teams should use now for Azure Blob Storage and what improves after the switch.
---

If you are running Laravel and searching for an Azure Blob Storage driver after `matthewbdaly/laravel-azure-storage`, use `azure-oss/storage-blob-laravel`.

## Why this is more than a package rename

The older Laravel package sits on top of the old League adapter, which itself sits on top of the old Microsoft Blob SDK.

So even if the Laravel surface looks simple, the stack underneath it is still the legacy one.

`azure-oss/storage-blob-laravel` changes that stack from the bottom up:

- maintained Blob SDK
- maintained Flysystem adapter
- maintained Laravel driver

## What Laravel teams usually care about most

### 1. Config clarity

The new package makes it easier to standardize on:

- `connection_string`
- `account_name` and `account_key`
- `temporary_url`
- `is_public_container`

### 2. Modern auth options

This is the biggest strategic upgrade.

The new package supports:

- `client_secret`
- `client_certificate`
- `workload_identity`
- `managed_identity`

That matters for apps running on Azure where you want to reduce long-lived secrets.

### 3. URL behavior

The new driver gives you a cleaner story for:

- public URLs
- signed temporary URLs
- custom origins such as Azure Front Door

## What to read next

If you want the practical config mapping, go to [Migrate from matthewbdaly/laravel-azure-storage](../8-migration-guides/3-matthewbdaly-laravel-azure-storage.md).
