---
sidebar_position: 2
slug: /blog/migrating-from-league-flysystem-azure-blob-storage
title: Migrating from league/flysystem-azure-blob-storage
description: Why the old Flysystem Azure Blob adapter is no longer the best default and how the azure-oss replacement differs.
---

`league/flysystem-azure-blob-storage` still appears in a lot of examples because Flysystem is widely trusted and the package name is memorable.

The problem is that it is now abandoned in favor of `azure-oss/storage-blob-flysystem`.

## Why the replacement matters

The old adapter is not just an old package name. It is also tied to the old Microsoft Blob SDK.

That means staying on it keeps your storage abstraction attached to legacy Blob clients even if the rest of your PHP app has moved on.

## What changes with the `azure-oss` adapter

- The adapter builds on `azure-oss/storage-blob`
- It takes a `BlobContainerClient` instead of a legacy `BlobRestProxy`
- It aligns with the Laravel filesystem driver in the same ecosystem
- It keeps Flysystem v3 while modernizing the storage layer underneath

## What you can do after migrating

The biggest practical benefits are not flashy. They are the kinds of things teams appreciate six months later:

- one maintained Blob stack instead of mixed generations of packages
- cleaner signed URL behavior
- clearer public-container behavior
- easier reuse of Blob SDK knowledge between direct SDK code and Flysystem-backed code

## When the migration is usually easy

This upgrade is usually smooth if:

- you already use Flysystem v3
- you construct the adapter yourself
- you can change the adapter namespace and constructor in one place

## Read the migration guide

Start with [Migrate from league/flysystem-azure-blob-storage](../8-migration-guides/2-league-flysystem-azure-blob-storage.md).
