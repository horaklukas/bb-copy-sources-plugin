# bb-copy-sources-plugin

[![Build Status](https://travis-ci.org/horaklukas/bb-copy-sources-plugin.svg?branch=master)](https://travis-ci.org/horaklukas/bb-copy-sources-plugin)

Plugin for **bobril-build** for copying all files from `src` directory to any other directory after each interactive recompile.

To enable copying of source files you have to go through two steps:
 
1. Create file with name `.copy` (probably at project root) and put there **path to copying destination directory** so then 
file content could looks like

```
/path/to/destination/dir
```

 
2. define **path to copy file** in package.json:

```json
{
	"bobril": {
        "plugins": {
            "bb-copy-sources-plugin": {
                "copyFile": "/path/to/file/.copy"
            }
        }
    }
}
```

#### Tip:

Filename `.copy` is not required, every other name will work.

### How it works

For example when you set as a destination empty directory `C:/test-plugin/` then new directory `C:/test-plugin/src` will
be created there after recompiling and all sources from your project `src` will be copied there.

### How to install or update:
	bb plugins -i bb-copy-sources-plugin