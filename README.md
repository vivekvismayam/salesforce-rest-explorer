# Salesforce REST Explorer Extension for VS Code

This extension provides a User Interface to perform REST API Callouts to Salesforce from SFDX Projects.

## Features

- No need to manually authorize,or select base url. 
- Default org will be selected.
- In case you change the default org in between, Click on 'Set Default Org' button to set the new default org.
- View Status and Status Code wilth Green/Red Background!
- View Response Time
- Click on 'Copy Response' to copy entire response body
- Click on 'Scroll To Headers' to easily access Response Headers
- Format Response Body To Hyperlink Salesforce Endpoints and click hyperlink to use it as next endpoint
- Turn off 'Format Response Body To Hyperlink Salesforce Endpoints' for faster display of reponses

## Requirements

- You should have SF CLI Installed in your system.
- You should use the extension from a sfdx project(Where a default org is set).

## Extension Settings

* `salesforce-rest-explorer.CLI Command`: If you are using older version of SF CLI and need to configure 'sfdx' command, you can select the same here

## Known Issues

1. Response Size is calculated from JS as 'Buffer.byteLength(JSON.stringify(response))'. This may not be accurate.

Please do report your issues in email vivekvismayam@hotmail.com.

## Contact Developer
- Website : [https://vivekvismayam.github.io](https://vivekvismayam.github.io) 
- Email : [vivekvismayam@hotmail.com](mailto:vivekvismayam@hotmail.com)
- LinkedIn : [https://www.linkedin.com/in/vivek-m-20b11675/](https://www.linkedin.com/in/vivek-m-20b11675/)

## Release Notes

### 1.0.2 -Bug Fix
- Bug fix done for SF Rest explorer to open even when the error apprears :::(node:2656) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead
