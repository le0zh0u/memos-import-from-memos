import axios from "axios";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./config.json");
const memosData = require("./memos.json");

function getHeaders() {
  const headers = {};
  if (config.targetToken) {
    headers.Authorization = `Bearer ${config.targetToken}`;
  }
  return headers;
}

async function callImportApi(contents, createdTs, visibility) {
  for (const content of contents) {
    try {
      const res = await axios({
        method: "post",
        url: config.targetUrl,
        headers: getHeaders(),
        data: {
          content: content,
          createdTs: createdTs,
          visibility: visibility,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.error("call api failed", error);
      console.log(content);
    }
  }
}

const chunkSize = 8100;

async function importMemos() {
  for (const memo of memosData.memos) {
    let contents = [];
    if (memo.content.length > 8192) {
      contents = Array.from(
        { length: Math.ceil(memo.content.length / chunkSize) },
        (_, i) => str.slice(i * chunkSize, (i + 1) * chunkSize)
      );
    } else {
      contents = [memo.content];
    }

    await callImportApi(contents, memo.createdTs, memo.visibility);
  }
}

importMemos();
