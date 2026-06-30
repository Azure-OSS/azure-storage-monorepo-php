---
sidebar_position: 1
slug: /blog/what-to-use-after-microsoft-azure-storage-blob
title: What to use after microsoft/azure-storage-blob
description: The recommended replacement for microsoft/azure-storage-blob in modern PHP applications.
---

If you are searching for what to use after `microsoft/azure-storage-blob`, the short answer is `azure-oss/storage-blob`.

That is the package in this ecosystem that directly replaces the old Microsoft Blob SDK while also fitting into the newer Flysystem and Laravel integrations.

## Why teams move off the old package

The old package still shows up in search results because it has years of historical installs, examples, and links behind it.

But when teams evaluate what to use now, they usually care about:

- current maintenance
- current PHP support
- modern authentication
- better docs for current Azure Blob features
- ecosystem fit with Flysystem and Laravel

That is where `azure-oss/storage-blob` wins.

## Detailed comparison

| Question | Legacy answer | Current answer |
| --- | --- | --- |
| Which package name do I install? | `microsoft/azure-storage-blob` | `azure-oss/storage-blob` |
| What is the main client? | `BlobRestProxy` | `BlobServiceClient` plus container/blob clients |
| Can I stay on connection strings at first? | Yes | Yes |
| Can I modernize auth later? | Limited legacy path | Yes, with `azure-oss/identity` and current docs |
| Does it fit the rest of this ecosystem? | No, it predates the current package line | Yes, it is the base for the current Flysystem and Laravel Blob packages |

## What improves after you migrate

- A clearer client model
- Better alignment with modern PHP projects
- Better support story for tags, versions, SAS flows, and related Blob features
- Better docs for the ecosystem around the Blob SDK

## Who should migrate first

The easiest candidates are teams that:

- already run PHP 8.2+
- still authenticate with connection strings
- use Blob Storage directly from application code
- plan to add Flysystem or Laravel integration next

## Read the step-by-step guide

For the practical migration path, go to [Migrate from microsoft/azure-storage-blob](../8-migration-guides/1-microsoft-azure-storage-blob.md).
