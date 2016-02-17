#!/usr/bin/env bash

cd "${0%/*}/.."

cat style/files | xargs jscs --config style/jscs.json --reporter node_modules/jscs-html-reporter/jscs-html-reporter.js
# mv jscs-html-report.html /usr/share/nginx/html/styleresults.html
