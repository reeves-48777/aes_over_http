import CryptoJS from 'crypto-js';
import { promises as fs } from 'fs';

function crawlB64String(str) {
  const b64regex = /^[A-Za-z0-9+/]+={0,2}$/;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charCode = str.charCodeAt(i);
    const hexCode = charCode.toString(16).toUpperCase();
    if (!b64regex.test(char)) {
      console.log(
        `Invalid Character: ${char}, position: ${i}, ASCII Code: ${charCode}, Hex: ${hexCode}`
      );
    }
  }
}

function isValidBase64(str) {
  if (str.length % 4 !== 0) {
    crawlB64String(str);
    return false;
  }

  const b64regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!b64regex.test(str)) {
    return false;
  }

  try {
    atob(str);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

class ApiSecurity {
  encryptionKey;
  cipher;

  constructor(key) {
    this.encryptionKey = CryptoJS.enc.Hex.parse(
      CryptoJS.SHA256(key).toString()
    );
    this.cipher = CryptoJS.AES;
  }

  encrypt(data) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = this.cipher.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      this.encryptionKey,
      {
        iv,
      }
    );
    const phrase =
      CryptoJS.enc.Base64.stringify(encrypted.ciphertext) +
      '::' +
      CryptoJS.enc.Base64.stringify(iv);

    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(phrase));
  }

  decrypt(data) {
    if (!isValidBase64(data)) {
      throw new Error('Invalid base64');
    }

    let decodedData = CryptoJS.enc.Base64.parse(data);
    decodedData = CryptoJS.enc.Utf8.stringify(decodedData);
    const parts = decodedData.split('::');
    if (parts.length !== 2) {
      console.log(parts);
      throw new Error('Invalid encrypted data format');
    }
    const encryptedData = CryptoJS.enc.Base64.parse(parts[0]);
    const iv = CryptoJS.enc.Base64.parse(parts[1]);

    const decrypted = this.cipher.decrypt(
      { ciphertext: encryptedData },
      this.encryptionKey,
      { iv }
    );
    const result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
    return result;
  }
}

const apiKey = '123456789';
const security = new ApiSecurity(apiKey);

fetch('http://server', {
  method: 'POST',
  headers: {
    'X-API-KEY': apiKey,
  },
  body: security.encrypt(
    JSON.stringify({
      data: {
        hello: 'Hello world',
        foo: 'bar',
      },
    })
  ),
})
  .then((r) => {
    return r.text();
  })
  .then((text) => {
    const payload = JSON.parse(text);
    console.log('payload reçu : ', payload);
    const decoded = security.decrypt(JSON.parse(payload.encoded));
    fs.writeFile('reponse.txt', JSON.stringify(decoded, null, 2), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Written successfully');
    });
  })
  .catch((error) => {
    console.error(error);
  });

// const test = {
//   data: 'Ceci est un test pas piqué des hannetons, vraiment je suis fier de la conversion là son pere la truite',
// };

// const encrypted = security.encrypt(JSON.stringify(test));
// console.log(encrypted);
// const decrypted = JSON.parse(security.decrypt(encrypted));
// console.log(decrypted);
