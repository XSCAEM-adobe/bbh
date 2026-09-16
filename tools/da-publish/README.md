# DA publish helpers

Utilities for publishing imported EDS content to Document Authoring (DA).

## `div2da.mjs`

Converts an EDS **div-based** `.plain.html` file (blocks as
`<div class="block-name">…`) into **Document Authoring source format**, where
blocks are represented as `<table>` (a header row with the block name, variants
in parentheses, then one `<tr>` per block row with one `<td>` per cell).
`section-metadata` and page `metadata` become their named tables; default
content passes through; the page is wrapped in
`<body><header></header><main>…</main><footer></footer>`.

This is required because the DA source API silently **flattens** div-based block
markup (dropping the wrapper divs and class attributes), so uploading the raw
`.plain.html` produces unstyled, un-blocked pages. DA expects table markup.

### Usage

```bash
node tools/da-publish/div2da.mjs <input.plain.html> <output.html>

# Upload the converted file to DA (no Authorization header — credentials are
# injected automatically when the DA opt-in is enabled):
curl -X POST -F "data=@output.html;type=text/html" \
  "https://admin.da.live/source/{org}/{repo}/{path}.html"

# Then preview + publish via the AEM admin pipeline:
curl -X POST "https://admin.hlx.page/preview/{org}/{repo}/main/{path}"
curl -X POST "https://admin.hlx.page/live/{org}/{repo}/main/{path}"
```

Requires `jsdom` (resolved from the project or the excat content-import skill).
