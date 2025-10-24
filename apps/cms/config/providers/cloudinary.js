const crypto = require('node:crypto');

const streamToBuffer = async (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('error', (error) => reject(error));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

const ensureFileBuffer = async (file) => {
  if (file.buffer) {
    return file.buffer;
  }

  if (!file.stream) {
    throw new Error('Cloudinary upload failed: file buffer or stream is required.');
  }

  const buffer = await streamToBuffer(file.stream);
  file.buffer = buffer;
  return buffer;
};

const createSignature = (params, apiSecret) => {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto.createHash('sha1').update(`${serialized}${apiSecret}`).digest('hex');
};

const normaliseTransformations = (value) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value.length > 0 ? value : undefined;
  }

  if (Array.isArray(value) && value.length === 0) {
    return undefined;
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === '{}' || serialized === '[]' ? undefined : serialized;
  } catch (error) {
    return undefined;
  }
};

const buildPublicId = (file) => {
  if (file.provider_metadata && file.provider_metadata.public_id) {
    return file.provider_metadata.public_id;
  }

  return file.hash;
};

const toErrorMessage = (response, payload) => {
  if (payload && payload.error && payload.error.message) {
    return payload.error.message;
  }

  if (!response.ok) {
    return `${response.status} ${response.statusText}`.trim();
  }

  return 'Unknown Cloudinary error';
};

const request = async (url, body) => {
  let response;

  try {
    response = await fetch(url, { method: 'POST', body });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cloudinary request failed: ${message}`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    payload = undefined;
  }

  if (!response.ok || (payload && payload.error)) {
    throw new Error(`Cloudinary request failed: ${toErrorMessage(response, payload)}`);
  }

  return payload;
};

const createCloudinaryProvider = (options = {}) => {
  const {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    default_transformations: defaultTransformations,
  } = options;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary upload provider is missing required credentials.');
  }

  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}`;
  const transformations = normaliseTransformations(defaultTransformations);

  const upload = async (file) => {
    const buffer = await ensureFileBuffer(file);
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = buildPublicId(file);

    const signatureParams = {
      public_id: publicId,
      timestamp: timestamp.toString(),
    };

    if (transformations) {
      signatureParams.transformation = transformations;
    }

    const signature = createSignature(signatureParams, apiSecret);

    const body = new URLSearchParams({
      api_key: apiKey,
      file: `data:${file.mime};base64,${buffer.toString('base64')}`,
      public_id: publicId,
      signature,
      timestamp: signatureParams.timestamp,
    });

    if (transformations) {
      body.append('transformation', transformations);
    }

    const result = await request(`${baseUrl}/auto/upload`, body);

    file.url = result.secure_url ?? result.url ?? null;
    file.provider_metadata = {
      ...(file.provider_metadata || {}),
      public_id: result.public_id,
      resource_type: result.resource_type,
    };

    return result;
  };

  return {
    upload,
    uploadStream: upload,
    delete: async (file) => {
      const publicId = file.provider_metadata?.public_id ?? file.hash;
      if (!publicId) {
        throw new Error('Cloudinary delete failed: missing file public_id.');
      }

      const resourceType = file.provider_metadata?.resource_type ?? 'image';
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = createSignature({ public_id: publicId, timestamp }, apiSecret);

      const body = new URLSearchParams({
        api_key: apiKey,
        public_id: publicId,
        signature,
        timestamp,
      });

      return request(`${baseUrl}/${resourceType}/destroy`, body);
    },
  };
};

module.exports = {
  init: createCloudinaryProvider,
};
