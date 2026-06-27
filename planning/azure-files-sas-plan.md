# Plan: Add Azure Files SAS URL Generation Package

## Goal

Add a new Azure Files package to this monorepo that supports service SAS URL generation for shares, directories, and files, following the shape of the .NET SDK closely, with no Laravel or Flysystem wrappers in this phase.

## Scope

Included:
- New package for Azure Files clients
- `ShareClient::canGenerateSasUri()`
- `ShareClient::generateSasUri(...)`
- `ShareDirectoryClient::canGenerateSasUri()`
- `ShareDirectoryClient::generateSasUri(...)`
- `ShareFileClient::canGenerateSasUri()`
- `ShareFileClient::generateSasUri(...)`
- File-share SAS builder and permission types
- Unit and feature tests for SAS URI generation
- Package README and subtree metadata

Excluded:
- Laravel wrappers
- Flysystem adapter
- User delegation SAS
- Full Azure Files CRUD surface beyond what is needed to create share, directory, and file clients and generate SAS URIs

## Package Shape

Create a new package:
- `src/FileShare`
- Composer package name: `azure-oss/storage-file-share`
- Namespace: `AzureOss\Storage\FileShare\`

Planned entry points:
- `ShareServiceClient`
- `ShareClient`
- `ShareDirectoryClient`
- `ShareFileClient`

## API Target

Mirror the .NET intent from Microsoft Learn:
- `ShareClient.GenerateSasUri(...)`
- `ShareFileClient.GenerateSasUri(...)`
- `CanGenerateSasUri`
- `ShareDirectoryClient.GenerateSasUri(...)`

PHP target shape:

```php
<?php

use AzureOss\Storage\FileShare\ShareServiceClient;
use AzureOss\Storage\FileShare\Sas\ShareDirectorySasPermissions;
use AzureOss\Storage\FileShare\Sas\ShareFileSasPermissions;
use AzureOss\Storage\FileShare\Sas\ShareSasBuilder;

$service = ShareServiceClient::fromConnectionString($connectionString);

$share = $service->getShareClient('documents');
$directory = $share->getDirectoryClient('contracts/2026');
$file = $directory->getFileClient('master-services-agreement.pdf');

if ($file->canGenerateSasUri()) {
    $url = $file->generateSasUri(
        ShareSasBuilder::new()
            ->setExpiresOn(new DateTimeImmutable('+15 minutes'))
            ->setPermissions(ShareFileSasPermissions::read())
    );
}

if ($directory->canGenerateSasUri()) {
    $url = $directory->generateSasUri(
        ShareSasBuilder::new()
            ->setExpiresOn(new DateTimeImmutable('+15 minutes'))
            ->setPermissions(ShareDirectorySasPermissions::read()->list())
    );
}
```

Optional convenience overloads, if we want to match .NET more closely:
- `ShareClient::generateSasUriFromPermissions(ShareSasPermissions|string $permissions, \DateTimeInterface $expiresOn): UriInterface`
- `ShareDirectoryClient::generateSasUriFromPermissions(ShareDirectorySasPermissions|string $permissions, \DateTimeInterface $expiresOn): UriInterface`
- `ShareFileClient::generateSasUriFromPermissions(ShareFileSasPermissions|string $permissions, \DateTimeInterface $expiresOn): UriInterface`

I would treat these as optional in v1 if the builder-based API lands first.

## Client Method Pattern

Follow the existing Blob package closely for the SAS methods on resource clients:
- `canGenerateSasUri()` returns `true` only when the client has a `StorageSharedKeyCredential`
- `generateSasUri(...)` throws when the credential cannot sign
- `generateSasUri(...)` stamps client-specific context onto the builder before calling `build(...)`
- development endpoints may relax the protocol to `https,http`, matching the Blob behavior

This mirrors the current patterns in:
- [src/Blob/BlobContainerClient.php](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Blob/BlobContainerClient.php:314)
- [src/Blob/BlobClient.php](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Blob/BlobClient.php:513)

Planned mapping:
- `ShareClient::generateSasUri()` stamps `shareName`
- `ShareDirectoryClient::generateSasUri()` stamps `shareName` and `directoryPath`
- `ShareFileClient::generateSasUri()` stamps `shareName`, `directoryPath` when present, and `filePath`

## Reuse From `Common`

Reuse directly:
- [StorageSharedKeyCredential](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Common/Auth/StorageSharedKeyCredential.php:1)
- [ClientFactory](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Common/Middleware/ClientFactory.php:1)
- [SasProtocol](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Common/Sas/SasProtocol.php:1)
- [SasIpRange](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Common/Sas/SasIpRange.php:1)
- [ApiVersion](/Users/brecht.vermeersch/PhpstormProjects/oss/azure-storage-monorepo/src/Common/ApiVersion.php:1)
- Connection-string parsing helpers already used by Blob and Queue

Likely add a small shared abstraction in `Common` only if duplication becomes obvious:
- SAS response-header fields
- shared builder validation helpers

Keep service-specific signing logic separate. Azure Files should have its own canonicalized resource and string-to-sign implementation.

## New Files / Types

Suggested initial set:

`src/FileShare`
- `composer.json`
- `README.md`
- `ShareServiceClient.php`
- `ShareClient.php`
- `ShareDirectoryClient.php`
- `ShareFileClient.php`

`src/FileShare/Sas`
- `ShareSasBuilder.php`
- `ShareSasPermissions.php`
- `ShareDirectorySasPermissions.php`
- `ShareFileSasPermissions.php`

`src/FileShare/Helpers`
- `ShareUriParserHelper.php`

`src/FileShare/Exceptions`
- `InvalidConnectionStringException.php`
- `InvalidShareUriException.php`
- `UnableToGenerateSasException.php`
- `FileShareStorageExceptionDeserializer.php`

`src/FileShare/Models`
- `ShareServiceClientOptions.php`
- `ShareClientOptions.php`
- `ShareDirectoryClientOptions.php`
- `ShareFileClientOptions.php`

`tests/FileShare`
- unit tests for permissions, URI parsing, SAS builder
- feature tests for share, directory, and file SAS URL generation

## Implementation Phases

## Phase 1: Package Scaffolding

- Add `src/FileShare/composer.json`
- Register PSR-4 namespace through the monorepo root autoload
- Add package README
- Make sure `.github/sync-package.php` will pick it up consistently with the other publishable packages

## Phase 2: Minimal Client Hierarchy

- Add `ShareServiceClient`
- Add `ShareClient`
- Add `ShareDirectoryClient`
- Add `ShareFileClient`
- Support construction from connection string and direct endpoint + credential
- Match repo patterns from Blob and Queue for client options and Guzzle setup
- Add URI parsing helper for Azure Files endpoints, including Azurite or dev-style handling if applicable

Navigation methods:
- `ShareServiceClient::getShareClient(string $shareName): ShareClient`
- `ShareClient::getDirectoryClient(string $directoryPath): ShareDirectoryClient`
- `ShareClient::getFileClient(string $filePath): ShareFileClient`
- `ShareDirectoryClient::getDirectoryClient(string $directoryPath): ShareDirectoryClient`
- `ShareDirectoryClient::getFileClient(string $fileName): ShareFileClient`

This keeps the navigation style close to .NET and close to the Blob package’s `getContainerClient()` and `getBlobClient()` pattern.

## Phase 3: SAS Model Layer

- Add `ShareSasBuilder`
- Add `ShareSasPermissions` for share-level SAS
- Add `ShareDirectorySasPermissions` for directory-level SAS
- Add `ShareFileSasPermissions` for file-level SAS
- Support:
  - expiry
  - optional start time
  - permissions
  - identifier
  - protocol
  - IP range
  - response header overrides: `rscc`, `rscd`, `rsce`, `rscl`, `rsct`
  - explicit service version override
  - directory depth parameter `sdd` when directory-scoped SAS is used

Builder should determine resource type from populated client context rather than making callers manually set raw `sr` values where possible.

## Phase 4: SAS Signing

- Implement Azure Files service SAS string-to-sign logic in `ShareSasBuilder`
- Canonicalized resource should use `/file/{account}/{share}` and `/file/{account}/{share}/{path}` semantics
- `ShareClient::generateSasUri()` should stamp share name into the builder
- `ShareDirectoryClient::generateSasUri()` should stamp share name, directory path, and directory depth
- `ShareFileClient::generateSasUri()` should stamp share name and file path
- `canGenerateSasUri()` should return true only for `StorageSharedKeyCredential`, matching Blob behavior
- For dev storage handling, mirror the Blob pattern if Azure Files local development endpoint semantics require protocol relaxation

Resource mapping:
- share SAS uses `sr=s`
- directory SAS uses `sr=d`
- file SAS uses `sr=f`

Directory SAS notes from Azure Storage REST:
- directory scope requires `sv >= 2020-02-10`
- directory scope requires `sdd`

## Phase 5: Tests

Unit tests:
- permission ordering and serialization
- canonicalized resource construction
- expected query params in generated SAS
- response-header override query params
- directory-scoped `sr=d` and `sdd` behavior
- failure when credential cannot sign
- failure when required SAS fields are missing

Feature tests:
- generate SAS URI for a share
- generate SAS URI for a directory
- generate SAS URI for a file
- verify signed resource is `s` for share, `d` for directory, and `f` for file
- verify a generated file SAS URL can read the target file when using shared key credentials
- verify directory SAS works against a file or listing operation inside the scoped directory if the emulator or test environment supports it
- verify non-shared-key clients report `canGenerateSasUri() === false`

## Phase 6: Docs

- Add README examples for:
  - share SAS
  - directory SAS
  - file SAS
  - shared-key requirement
- Document explicitly that this phase only supports service SAS generation
- Note that Laravel and Flysystem integration is intentionally out of scope

## Design Decisions To Lock Before Coding

1. Package name: `azure-oss/storage-file-share` is the cleanest fit.
2. Client naming: use `ShareServiceClient`, `ShareClient`, `ShareDirectoryClient`, and `ShareFileClient` to align with .NET.
3. First release surface: builder-based `generateSasUri()` is required; permission+expiry convenience overloads are optional.
4. Directory client: include it in the first implementation, not as a follow-up.
5. Aliases: probably unnecessary in v1 unless you already want backwards-compatibility placeholders.

## Risks / Gotchas

- Azure Files SAS signing is close to Blob SAS, but not identical; we should not generalize too early.
- Directory SAS has extra rules such as `sr=d` and `sdd`, so the builder should model that explicitly.
- User delegation SAS appears in the .NET surface, but it should stay out of this first implementation to avoid mixing scopes.
- Azurite or local Azure Files support may differ from Blob and should be validated separately before assuming the same dev-path behavior.

## Suggested Delivery Order

1. Scaffold `src/FileShare`
2. Implement minimal clients and URI parsing
3. Implement share, directory, and file SAS builder and permissions
4. Add `canGenerateSasUri()` and `generateSasUri()`
5. Add tests
6. Add docs

## Reference Docs

- [ShareFileClient (.NET)](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.files.shares.sharefileclient?view=azure-dotnet)
- [ShareClient (.NET)](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.files.shares.shareclient?view=azure-dotnet)
- [Create a service SAS (REST)](https://learn.microsoft.com/en-us/rest/api/storageservices/create-service-sas)
