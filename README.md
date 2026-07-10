# Digital Carrot Browser Extensions

This repository contains the browser extensions that are needed to block websites on Windows and Mac. It contains two main things:

- The code for the various browser extensions
- A browser_support.json file

The browser_support.json file is downloaded by Digital Carrot clients and can be used to add support for new browsers in older versions of the client. Versions 1.6 and lower have an issue where unknown fields cannot be unmarshaled in the JSON file, so clients older than v1.7.0 will download `browser_support.json` and versions newer than v1.7.0 will download `browser_support_v1_7_0.json`
