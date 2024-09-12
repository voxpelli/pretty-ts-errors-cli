Type `typeof import("/home/runner/work/neostandard/neostandard/node_modules/@stylistic/eslint-plugin/dist/dts/index")` is not assignable to type `Plugin`.
  Types of property `configs` are incompatible.
    Type: 
```ts
{
  "disable-legacy": Config<RulesRecord>;
  customize: {
    (options: StylisticCustomizeOptions<false>): BaseConfig<
      RulesRecord,
      RulesRecord
    >;
    (
      options?:
        | StylisticCustomizeOptions<...>
        | undefined
    ): Config<...>;
  };
  /* 4 more */;
  "recommended-legacy": BaseConfig<...>;
}
```

 is not assignable to type: 
```ts
Record<
  string,
  | Config<RulesRecord>
  | LegacyConfig<RulesRecord, RulesRecord>
  | Config<RulesRecord>[]
>
```

.
      Property `'customize'` is incompatible with index signature.
        Type: 
```ts
{
  (options: StylisticCustomizeOptions<false>): BaseConfig<
    RulesRecord,
    RulesRecord
  >;
  (
    options?: StylisticCustomizeOptions<true> | undefined
  ): Config<...>;
}
```

 is not assignable to type: 
```ts
| Config<RulesRecord>
  | LegacyConfig<RulesRecord, RulesRecord>
  | Config<RulesRecord>[]
```

.

