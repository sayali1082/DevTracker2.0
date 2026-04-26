# Security Spec: DevTracker 2.0

## 1. Data Invariants
- `User`: `uid` must match document ID. `githubUsername` and `displayName` must be strings < 100 chars.
- `Project`: `userId` must match parent user ID. `title` must be < 100 chars. `status` must be one of ["In Progress", "Completed"].

## 2. The Dirty Dozen (Test Payloads)
1. **Identity Spoofing**: Attempt to create a user document with a different UID in the data.
2. **Path Injection**: Attempt to create a document with a 1MB string as ID.
3. **Ghost Field**: Adding `isAdmin: true` to a user document.
4. **Invalid Enum**: Setting project status to "Archived".
5. **Orphaned Write**: Creating a project for a user that doesn't exist.
6. **Immutability Breach**: Changing `userId` on an existing project.
7. **Cross-User Write**: Saving a project into another user's subcollection.
8. **Size Flooding**: Sending a 1MB string for project description.
9. **Timestamp Fraud**: Providing a manual `createdAt` far in the future.
10. **PII Leak**: A signed-in user trying to read another user's email (if email isn't public).
11. **Type Poisoning**: Sending `techStack: "React"` instead of `["React"]`.
12. **Query Scraping**: Attempting to `list` all users without a specific filter.

## 3. Test Runner (Draft)
```ts
// firestore.rules.test.ts (logic used for rule verification)
// All these must return PERMISSION_DENIED
```
