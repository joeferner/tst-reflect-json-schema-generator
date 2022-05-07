
# Install

- See [tst-reflect: How To Start](https://github.com/Hookyns/tst-reflect#how-to-start) to get runtime type information.
- Run `pnpm install tst-reflect-json-schema-generator`

# Usage

```
import { createJsonSchema } from "tst-reflect-json-schema-generator";

export interface MyData {
    propA: number;
    propB: number;
    propC: string;
}

const schema = createJsonSchema(getType<MyData>());
```
