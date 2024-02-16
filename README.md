<img align="right" height="100" src="icon.png">

# AngelTaT

AngelTaT is a bunch of jumpyscript helpers that I **dont** use in my projects.

## How to use it

Import from it.

```html
<script type="module">
  import { print } from "./habitat.js";
  print("Hello world!");
</script>
```

If you want to embed it instead, just Ctrl+F and delete every `export` in the file. Then...

```html
<script src="habitat.js"></script>
<script>
  print("Hello world!");
</script>
```
