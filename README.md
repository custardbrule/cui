# cui

## React 19

Install React 19 alongside `cui`, then import typed component wrappers from the
React subpath:

```tsx
import { InputV1, SelectV1, ButtonV1 } from "cui/react";

function Example() {
  return (
    <>
      <InputV1 label="Email" name="email" type="email" required />
      <SelectV1
        label="Plan"
        name="plan"
        onChange={(event) => {
          console.log((event.target as HTMLSelectElement).value);
        }}
      >
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </SelectV1>
      <ButtonV1 type="submit">Continue</ButtonV1>
    </>
  );
}
```

The React entry provides typed wrappers for all custom elements. Refs point to
the corresponding custom-element instance. Element definitions are loaded after
mount, so importing `cui/react` is safe in server-rendered React applications;
custom-element attributes are applied in the browser after the definition loads.
The wrappers require React 19.
