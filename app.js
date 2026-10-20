'use strict';

const http = require('http');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const port = Number(process.env.PORT || 8080);
const bucket = process.env.S3_BUCKET || '';
const objectKey = process.env.S3_OBJECT_KEY || 'message.txt';
const region = process.env.AWS_REGION || 'us-east-1';
const hostname = process.env.HOSTNAME || 'unknown';

const client = new S3Client({ region });

function fallback(reason) {
  console.error('s3 read fallback:', reason);
  return 'Hello World';
}

async function readMessage() {
  if (!bucket) {
    return fallback('S3_BUCKET is empty');
  }
  try {
    const out = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey }));
    const text = await out.Body.transformToString();
    const body = String(text).replace(/\s+$/, '');
    if (!body) {
      return fallback('object is empty');
    }
    return body;
  } catch (err) {
    const name = err && (err.name || err.Code) ? (err.name || err.Code) : 'Error';
    const message = err && err.message ? err.message : String(err);
    return fallback(name + ' ' + message);
  }
}

const server = http.createServer(async (req, res) => {
  const body = await readMessage();
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body + '\nserved-by: ' + hostname + '\n');
});

server.listen(port, () => {
  console.log('listening on ' + port + ' bucket=' + bucket + ' key=' + objectKey);
});
