# Nest / Prisma / TypeScript Resources

## Knowledge

- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  Primitives, annotations, return types, `Promise<T>`, object types, unions. Use for: what `: Promise<Node[]>` even means.
- [TypeScript Handbook: Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
  Structural subtyping: `x` is compatible with `y` if `y` has at least the same members as `x`. Use for: why two types named `Node` are still different.
- [TypeScript Handbook: `Record<Keys, Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
  Official definition of `Record`. Use for: what `Record<string, unknown>` actually allows.
- [Prisma: Working with Json fields](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields)
  Documents `JsonValue = string | number | boolean | null | JsonObject | JsonArray`. Use for: why Prisma `attributes` is wider than a Record.
- [Prisma: Writing to a Json field](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#writing-to-a-json-field)
  JavaScript objects are converted to JSON; do not `JSON.stringify` first. Use for: the create/update payload.
- [Prisma v6: Relation queries — nested writes](https://www.prisma.io/docs/v6/orm/prisma-client/queries/relation-queries#nested-writes)
  Parent `create` with nested `create` is one transaction. Use for: why `POST /workspaces` already inserts graph + default view. (v6 docs match the Prisma 7 client API in this repo; current prisma.io frontpage is Prisma 8.)
- [Prisma v6: upsert](https://www.prisma.io/docs/v6/orm/prisma-client/queries/crud#update-or-create-records)
  `where` (unique) + `update` + `create`. Use for: `PUT` of `graph_view_layouts` on `(viewId, nodeId)`.
- [NestJS: Controllers](https://docs.nestjs.com/controllers)
  `@Controller` prefix, `@Get(':id')`, `@Query`, `@Patch`. Use for: Graph/View route shape.
- [Nexus data-model: graphs / views / layouts](docs/data-model.md)
  Product rules: one graph per workspace in MVP, one default view, layout off the node, no x/y on nodes.
- [ADR 0001](docs/adr/0001-normalized-postgres-graph.md)
  Positions live on the view, not the node.

## Wisdom (Communities)

- [TypeScript Discord](https://discord.com/invite/typescript)
  Official TS community. Use for: assignability puzzles that the handbook example does not cover.
- [Prisma Discord](https://pris.ly/discord)
  Use for: Json field typing and client generation issues.

## Gaps

- No first-party Nest chapter that walks Prisma `Json` vs a hand-written class. This workspace fills that with Nexus `Node`.
