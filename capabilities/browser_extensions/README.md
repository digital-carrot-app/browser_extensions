Common files for the browser extensions are stored in common/. Browser specific files are stored under their respective directory.

We're using Make to build the browser extensions so that we don't have to duplicate code between all of the various extensions. To run the extensions run:

```
make firefox
make chrome
```

Load the build extensions from the build/chrome/ and build/firefox/ directories.
