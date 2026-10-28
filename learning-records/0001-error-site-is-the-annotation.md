# The error lives on the annotated return, not inside findMany

Pietro correctly identified that the red squiggle is about the return type of `findAll`, not about Prisma failing to query. He could not yet walk why `Node` from `node.model.ts` is a different type from the object Prisma returns. Next lessons can skip “where is the error” and must not skip structural comparison of `attributes`.
