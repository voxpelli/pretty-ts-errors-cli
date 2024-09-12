Type `typeof import("/home/runner/work/neostandard/neostandard/node_modules/@stylistic/eslint-plugin/dist/dts/index")` is not assignable to type `Plugin`.
  Types of property `configs` are incompatible.
    Type: 
```type
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
```type
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
```type
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
```type
| Config<RulesRecord>
  | LegacyConfig<RulesRecord, RulesRecord>
  | Config<RulesRecord>[]
```
.

