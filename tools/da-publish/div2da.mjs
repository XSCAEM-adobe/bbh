import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

// Resolve jsdom from wherever it is installed (project node_modules first;
// falls back to the excat content-import skill's bundled copy).
const require = createRequire(import.meta.url);
let JSDOM;
try {
  ({ JSDOM } = require('jsdom'));
} catch {
  ({ JSDOM } = require(
    '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/jsdom',
  ));
}

/*
 * Convert EDS div-based .plain.html (blocks as <div class="name">…) into
 * Document Authoring source format. DA represents blocks as <table>: a header
 * row with the block name (variants in parentheses) and one <tr> per block row
 * with one <td> per cell. section-metadata / metadata become their named
 * tables. Default content passes through. The whole page is wrapped in
 * <body><header></header><main>…</main><footer></footer>.
 */

const [, , inPath, outPath] = process.argv;
const raw = readFileSync(inPath, 'utf-8');
const dom = new JSDOM(`<!DOCTYPE html><body>${raw}</body>`);
const { document } = dom.window;

function blockDisplayName(classList) {
  const [name, ...variants] = classList;
  const proper = name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return variants.length ? `${proper} (${variants.join(', ')})` : proper;
}

function makeTable(headerText) {
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.textContent = headerText;
  tr.appendChild(td);
  table.appendChild(tr);
  return table;
}

// Shared block>row>cell -> table body. Each direct child div is a row; its
// child divs are cells (or the row div itself is a single cell).
function appendRows(table, blockDiv) {
  const rows = [...blockDiv.children].filter((c) => c.tagName === 'DIV');
  rows.forEach((rowDiv) => {
    const tr = document.createElement('tr');
    const cells = [...rowDiv.children].filter((c) => c.tagName === 'DIV');
    if (cells.length === 0) {
      const td = document.createElement('td');
      while (rowDiv.firstChild) td.appendChild(rowDiv.firstChild);
      tr.appendChild(td);
    } else {
      cells.forEach((cellDiv) => {
        const td = document.createElement('td');
        while (cellDiv.firstChild) td.appendChild(cellDiv.firstChild);
        tr.appendChild(td);
      });
    }
    table.appendChild(tr);
  });
}

function blockToTable(blockDiv) {
  const table = makeTable(blockDisplayName([...blockDiv.classList]));
  appendRows(table, blockDiv);
  return table;
}

// section-metadata / metadata use the same block>row>cell nesting.
function namedTable(div, header) {
  const table = makeTable(header);
  appendRows(table, div);
  return table;
}

function stripComments(node) {
  const walker = document.createTreeWalker(node, dom.window.NodeFilter.SHOW_COMMENT);
  const toRemove = [];
  while (walker.nextNode()) toRemove.push(walker.currentNode);
  toRemove.forEach((c) => c.remove());
}

const topDivs = [...document.body.children].filter((c) => c.tagName === 'DIV');
const main = document.createElement('main');

topDivs.forEach((section) => {
  stripComments(section);
  const sectionDiv = document.createElement('div');
  [...section.childNodes].forEach((node) => {
    if (node.nodeType !== 1) {
      if (node.textContent.trim()) sectionDiv.appendChild(node.cloneNode(true));
      return;
    }
    const el = node;
    if (el.tagName === 'DIV' && el.classList.contains('section-metadata')) {
      sectionDiv.appendChild(namedTable(el, 'Section Metadata'));
    } else if (el.tagName === 'DIV' && el.classList.contains('metadata')) {
      sectionDiv.appendChild(namedTable(el, 'Metadata'));
    } else if (el.tagName === 'DIV' && el.classList.length > 0) {
      sectionDiv.appendChild(blockToTable(el));
    } else {
      sectionDiv.appendChild(el.cloneNode(true));
    }
  });
  main.appendChild(sectionDiv);
});

const out = `<body>\n  <header></header>\n  ${main.outerHTML}\n  <footer></footer>\n</body>\n`;
writeFileSync(outPath, out, 'utf-8');
console.log(`wrote ${outPath}`);
