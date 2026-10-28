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

## Wisdom (Communities)

- [TypeScript Discord](https://discord.com/invite/typescript)
  Official TS community. Use for: assignability puzzles that the handbook example does not cover.
- [Prisma Discord](https://pris.ly/discord)
  Use for: Json field typing and client generation issues.

## Gaps

- No first-party Nest chapter that walks Prisma `Json` vs a hand-written class. This workspace fills that with Nexus `Node`.
