---
sidebar_position: 4
slug: /blog/modern-azure-queue-for-laravel
title: Modern Azure Queue for Laravel without squigg/azure-queue-laravel
description: The modern Laravel queue driver for Azure Storage Queues and how it compares with the older package line.
---

If you are looking for a modern Azure Queue driver for Laravel, the recommended package in this ecosystem is `azure-oss/storage-queue-laravel`.

It replaces `squigg/azure-queue-laravel` and aligns your queue integration with `azure-oss/storage-queue`.

## Why teams move

The older package still works for many teams, but it is built on the legacy Microsoft Queue SDK and older config conventions.

The new package keeps the Laravel integration focused while modernizing the queue layer underneath it.

## What changes in practice

### Cleaner configuration

Instead of fields like `accountname`, `key`, `timeout`, and `endpoint`, the new package uses more explicit names:

- `account_name`
- `account_key`
- `retry_after`
- `endpoint_suffix`

### Better connection-string support

If your infrastructure already stores a storage connection string, the new connector can use it directly.

That gives the package a more flexible auth story than the older Laravel queue driver:

- shared key connection strings
- explicit account name and key config
- SAS-bearing connection strings
- custom queue endpoints for local and emulator-style environments

### Better Laravel alignment

The new connector adds useful queue options such as:

- `time_to_live`
- `create_queue`
- `after_commit`

## Read the migration guide

Go to [Migrate from squigg/azure-queue-laravel](../8-migration-guides/5-squigg-azure-queue-laravel.md).
