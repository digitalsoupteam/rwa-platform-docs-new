# API Reference Generator

Документация API (GraphQL + REST) генерируется из исходников бэкенда одним скриптом.

## Источники

| Что | Где |
|---|---|
| GraphQL схемы | `rwa-backend-new2/services/gateway/src/graphql/modules/*/schema.graphql` |
| REST контроллеры | `rwa-backend-new2/services/gateway/src/controllers/*.controller.ts` |
| Генератор | `rwa_docs_new/scripts/gen-api-data.ts` |
| Результат | `rwa_docs_new/src/lib/api-data.ts` (автогенерится, не редактировать руками) |

## Когда запускать

После **любого** изменения в GraphQL-схемах или REST-контроллерах бэкенда:
- добавили/удалили поле в типе
- добавили/удалили мутацию или запрос
- изменили input-тип
- добавили новый REST endpoint
- изменили enum

## Как обновить

```bash
cd C:\Users\User\Desktop\WORK2025\rwa_docs_new

# 1. Сгенерировать api-data.ts из схем
bun run scripts/gen-api-data.ts

# 2. Проверить что TypeScript компилится без ошибок
bunx tsc --noEmit

# 3. (опционально) запустить dev-сервер и визуально проверить
bun run dev
```

Если `tsc --noEmit` ругается — почти всегда это значит, что в схеме что-то нестандартное (новый кастомный скаляр, синтаксис которого не покрыт парсером). Править нужно в `scripts/gen-api-data.ts`, не в сгенерированном файле.

## Что генерируется автоматически

- **135 GraphQL операций** (Query / Mutation / Subscription) из 19 модулей
- **4 REST endpoint** из Elysia-контроллеров
- **65 типов**, 103 input-типа, 12 enum'ов
- Input-типы инлайнятся в `params` как `children` (рекурсивно)
- Return-типы полностью раскрываются — вложенные кастомные типы становятся литералами
- Enum-значения инлайнятся в description: `enum: like | dislike | love`
- MDX-страницы (`content/docs/api/**/*.mdx`) **не генерируются** — их нужно создавать вручную, если добавлена новая операция

## Структура api-data.ts

```
apiModuleMeta       — { module: { label, icon } }     — метаданные модулей
apiSubgroupLabels   — { subgroup: label }              — человекочитаемые названия подгрупп
apiOperations       — ApiOperation[]                   — все операции (GraphQL + REST)
typeDefs            — Record<string, string>           — поля типов (для обратной совместимости)
getApiOperation()   — lookup по module + name
getModuleOperations() — все операции модуля
formatReturnType()  — раскрывает \n в многострочный вывод
```

## Добавление новой операции в доках

1. Добавить операцию в GraphQL-схему бэкенда
2. Запустить генератор (см. выше)
3. Создать MDX-страницу в `content/docs/api/<module>/<subgroup>/<operation-name>.mdx`:

```mdx
---
title: operationName
description: Module — Mutation
---

<ApiEndpoint module="moduleName" operation="operationName" />
```

4. Добавить страницу в `content/docs/api/<module>/<subgroup>/meta.json` в массив `pages`
5. `bunx tsc --noEmit` — проверить что всё компилится