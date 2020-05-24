import { createHmac } from 'crypto';

function generateSasToken(
  resourceUri: string,
  signingKey: string,
  policyName: string,
  expiresInMins: number
) {
  resourceUri = encodeURIComponent(resourceUri);

  // Set expiration in seconds
  let expires = Date.now() / 1000 + expiresInMins * 60;
  expires = Math.ceil(expires);
  const toSign = resourceUri + '\n' + expires;

  // Use crypto
  const hmac = createHmac('sha256', Buffer.from(signingKey, 'base64'));
  hmac.update(toSign);
  const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

  // Construct authorization string
  let token =
    'SharedAccessSignature sr=' +
    resourceUri +
    '&sig=' +
    base64UriEncoded +
    '&se=' +
    expires;
  if (policyName) {
    token += '&skn=' + policyName;
  }
  return token;
}

console.log(
  generateSasToken(
    'LeGardenHub.azure-devices.net',
    'XXX',
    'iothubowner',
    525600
  )
);
