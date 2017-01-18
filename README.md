# bb-copy-sources-plugin
Plugin for **bobril-build** for copying all files from `src` directory to any other directory after each interactive recompile.

To enable copying of source files you have to define **destination** in package.json:

```
{
	"bobril": {
        "plugins": {
            "bb-copy-sources-plugin": {
                "destination": "/Path/to/destination/dir"
            }
        }
    }
}
```

For example when you set as a destination empty directory `C:/test-plugin/` then there will be new directory `C:/test-plugin/src`
after recompiling.

### How to install or update:
	bb plugins -i bb-copy-sources-plugin