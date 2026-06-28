[The closest thing i found out for a guide bout making a browser fork is this](https://www.youtube.com/watch?v=hV2r0RcvgWo) 
There are build tools to make firefox forks that kind of streamlines the whole setup and maintain process. Im using surfer. Its a tool thats also maintained by the zen guys.
Zen comes with that builtin. 
[The zen docs shows how to build it from source and the projects code structure](https://docs.zen-browser.app/contribute/desktop)
## Surfer commands

| Command                                      | Description                                           |
| -------------------------------------------- | ----------------------------------------------------- |
| `surfer build`                               | Full browser build                                    |
| `surfer build --ui`                          | Rebuild only the UI (faster, skips C++ recompilation) |
| `surfer import`                              | Apply patches from `src/` into `engine/`              |
| `surfer export`                              | Export changes from `engine/` back as patches         |
| `surfer download`                            | Download Firefox sources                              |
| `surfer bootstrap`                           | Install Firefox build dependencies                    |
| `surfer package`                             | Create distributable packages                         |
| `surfer update`                              | Sync to a new Firefox version (raw)                   |
| `surfer reset`                               | Reset `engine/` back to vanilla Firefox               |
| `surfer license-check`                       | Check files have MPL headers                          |
| `surfer license-check --fix`                 | Auto-add missing MPL headers                          |
| `surfer ci --brand <name> --display-version` | Run CI with the specified brand and display version   |
#### How to sync with Zen

```text
# Re-apply patches after a Firefox version bump
git pull 
npm run sync             # Zen's script that handles the FF version update
npm run import
npm run build
```


