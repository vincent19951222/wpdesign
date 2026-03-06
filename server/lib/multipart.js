const { ApiError } = require('./errors');

const HEADER_BODY_SEPARATOR = Buffer.from('\r\n\r\n');
const CRLF = Buffer.from('\r\n');
const DEFAULT_MULTIPART_LIMIT_BYTES = 20 * 1024 * 1024;

function getBoundary(contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  return match?.[1] || match?.[2] || '';
}

function parseDisposition(value) {
  const segments = value.split(';').map((segment) => segment.trim());
  const params = {};

  segments.slice(1).forEach((segment) => {
    const [rawKey, rawValue] = segment.split('=');
    if (!rawKey) {
      return;
    }

    params[rawKey.toLowerCase()] = (rawValue || '').replace(/^"|"$/g, '');
  });

  return {
    type: segments[0]?.toLowerCase() || '',
    name: params.name,
    filename: params.filename,
  };
}

function indexOfBuffer(haystack, needle, start = 0) {
  return haystack.indexOf(needle, start);
}

function readRequestBody(req, limitBytes = DEFAULT_MULTIPART_LIMIT_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    let completed = false;

    const cleanup = () => {
      req.removeListener('data', onData);
      req.removeListener('end', onEnd);
      req.removeListener('error', onError);
    };

    const finish = (callback) => {
      if (completed) {
        return;
      }

      completed = true;
      cleanup();
      callback();
    };

    const onData = (chunk) => {
      if (completed) {
        return;
      }

      totalBytes += chunk.length;

      if (totalBytes > limitBytes) {
        finish(() => {
          req.resume();
          reject(new ApiError('INVALID_INPUT', 'Multipart payload exceeds the maximum allowed size.', {
            statusCode: 413,
            details: {
              limitBytes,
            },
          }));
        });
        return;
      }

      chunks.push(chunk);
    };

    const onEnd = () => {
      finish(() => {
        resolve(Buffer.concat(chunks));
      });
    };

    const onError = (error) => {
      finish(() => {
        reject(error);
      });
    };

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
  });
}

function stripLeadingCrlf(buffer) {
  if (buffer.subarray(0, CRLF.length).equals(CRLF)) {
    return buffer.subarray(CRLF.length);
  }

  return buffer;
}

function stripTrailingCrlf(buffer) {
  if (
    buffer.length >= CRLF.length &&
    buffer.subarray(buffer.length - CRLF.length).equals(CRLF)
  ) {
    return buffer.subarray(0, buffer.length - CRLF.length);
  }

  return buffer;
}

function parseHeaders(buffer) {
  const headers = {};
  const headerText = buffer.toString('utf8');

  headerText.split('\r\n').forEach((line) => {
    const delimiterIndex = line.indexOf(':');
    if (delimiterIndex === -1) {
      return;
    }

    const key = line.slice(0, delimiterIndex).trim().toLowerCase();
    const value = line.slice(delimiterIndex + 1).trim();
    headers[key] = value;
  });

  return headers;
}

function parsePart(partBuffer, fields, files) {
  const separatorIndex = indexOfBuffer(partBuffer, HEADER_BODY_SEPARATOR);

  if (separatorIndex === -1) {
    return;
  }

  const headers = parseHeaders(partBuffer.subarray(0, separatorIndex));
  const disposition = parseDisposition(headers['content-disposition'] || '');

  if (disposition.type !== 'form-data' || !disposition.name) {
    return;
  }

  const bodyBuffer = partBuffer.subarray(separatorIndex + HEADER_BODY_SEPARATOR.length);

  if (disposition.filename) {
    files[disposition.name] = {
      fieldName: disposition.name,
      filename: disposition.filename,
      mimeType: headers['content-type'] || 'application/octet-stream',
      buffer: bodyBuffer,
      size: bodyBuffer.length,
    };
    return;
  }

  fields[disposition.name] = bodyBuffer.toString('utf8');
}

function extractParts(rawBody, boundaryBuffer) {
  const parts = [];
  let cursor = 0;

  while (cursor < rawBody.length) {
    const boundaryIndex = indexOfBuffer(rawBody, boundaryBuffer, cursor);

    if (boundaryIndex === -1) {
      break;
    }

    const afterBoundary = boundaryIndex + boundaryBuffer.length;
    const boundarySuffix = rawBody.subarray(afterBoundary, afterBoundary + 2);

    if (boundarySuffix.length === 2 && boundarySuffix[0] === 45 && boundarySuffix[1] === 45) {
      break;
    }

    let partStart = afterBoundary;

    if (
      rawBody.length >= partStart + CRLF.length &&
      rawBody.subarray(partStart, partStart + CRLF.length).equals(CRLF)
    ) {
      partStart += CRLF.length;
    }

    const nextBoundaryIndex = indexOfBuffer(rawBody, boundaryBuffer, partStart);

    if (nextBoundaryIndex === -1) {
      break;
    }

    let partEnd = nextBoundaryIndex;

    if (
      partEnd >= CRLF.length &&
      rawBody.subarray(partEnd - CRLF.length, partEnd).equals(CRLF)
    ) {
      partEnd -= CRLF.length;
    }

    let partBuffer = rawBody.subarray(partStart, partEnd);
    partBuffer = stripTrailingCrlf(stripLeadingCrlf(partBuffer));

    if (partBuffer.length > 0) {
      parts.push(partBuffer);
    }

    cursor = nextBoundaryIndex;
  }

  return parts;
}

async function parseMultipartForm(req) {
  const contentType = req.headers['content-type'] || '';
  const boundaryValue = getBoundary(contentType);

  if (!contentType.toLowerCase().includes('multipart/form-data') || !boundaryValue) {
    throw new ApiError('INVALID_INPUT', 'Request must use multipart/form-data.', {
      statusCode: 400,
    });
  }

  const boundaryBuffer = Buffer.from(`--${boundaryValue}`);
  const rawBody = await readRequestBody(req);
  const parts = extractParts(rawBody, boundaryBuffer);
  const fields = {};
  const files = {};

  parts.forEach((partBuffer) => {
    parsePart(partBuffer, fields, files);
  });

  return {
    fields,
    files,
  };
}

module.exports = {
  parseMultipartForm,
};
