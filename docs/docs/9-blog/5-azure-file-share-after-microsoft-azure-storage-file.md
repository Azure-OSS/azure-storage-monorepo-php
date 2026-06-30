---
sidebar_position: 5
slug: /blog/azure-file-share-after-microsoft-azure-storage-file
title: Azure File Share for PHP after microsoft/azure-storage-file
description: What to use after microsoft/azure-storage-file and when an Azure Files mount is a better fit than a PHP SDK.
---

If you are searching for what to use after `microsoft/azure-storage-file`, the honest answer is:

- use `azure-oss/storage-file-share` if your main need is Azure Files service access and SAS generation
- use an Azure Files SMB or NFS mount if your real need is normal filesystem-style I/O

That distinction matters more for File Share than it does for Blob or Queue.

## Why this migration is different

Blob and Queue have straightforward SDK replacement stories in this ecosystem.

File Share is different because many applications do not actually want a service SDK. They want a mounted filesystem.

If your app wants to open, write, move, and manage files like ordinary local storage, a mounted Azure File Share is often the better fit.

## Where `azure-oss/storage-file-share` fits today

The current package is strongest when you need:

- Azure Files client navigation
- SAS generation for shares and files
- Azure-specific service access patterns

That makes it useful, but it also means you should not market it as full parity with every legacy `FileRestProxy` workflow today.

## Why that honesty helps adoption

Clear migration guidance builds trust.

When teams land on your docs from search, they are more likely to adopt the package if you help them choose the right path instead of overpromising a drop-in replacement.

## Read the migration guide

Start with [Migrate from microsoft/azure-storage-file](../8-migration-guides/6-microsoft-azure-storage-file.md).
