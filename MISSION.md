# Mission: Nest, Prisma, and types while shipping Nexus

## Why
Pietro is building the Nexus graph API in NestJS and Prisma. He needs to read TypeScript errors as contracts between his models and the database client, so he can finish Node, Relation, and View without stalling on red squiggles.

## Success looks like
- Write a service method that returns Prisma data with an annotation that type-checks.
- When a `Promise<X>` error appears, name the field that failed structural comparison.
- Distinguish DTO (what the client sends) from Prisma model (what the database returns).

## Constraints
- Learning happens inside the Nexus codebase, not a toy app.
- Prefers Portuguese explanations and working directly in code.
- No separate study block: each lesson must unlock the next Nexus feature.

## Out of scope
- Advanced Prisma JSON path filters.
- Nominal type systems (Java/C#) beyond the contrast needed for structural typing.
- Auth, CRDT, and Flow — later product work.
