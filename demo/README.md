# demo projects
demo projects use the distributed variant of the module/package

### `./webpack`
demo for using the module with a bundler, in this example *webpack* through *vue-cli*

### `./browser`
using module by inclusion via `<script>`-tag in browser

Logger will auto-register; no call to `Vue.use()` necessary. The logger will only be available as `logger.<log|warn|error>()`, without customizable name.
