var XDomainRequest: any;

const successResponses = [200, 201];
const createCORSRequest = function(method: string, url: string, opts?: any) {
  var opts = opts || {};
  var xhr: any = new XMLHttpRequest();

  if (xhr.withCredentials != null) {
    xhr.open(method, url, true);
    if (opts.withCredentials != null) {
      xhr.withCredentials = opts.withCredentials;
    }
  } else if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

export const uploadStorage = (
  file: File,
  signResult: { signedUrl: string; headers?: any },
  options: any,
) => {
  var xhr = createCORSRequest('PUT', signResult.signedUrl);
  if (!xhr) {
    options.onError(null, 'CORS not supported');
  } else {
    xhr.onload = function() {
      if (successResponses.indexOf(xhr.status) >= 0) {
        options.onProgress({ percent: 100 });
        return options.onSuccess(signResult);
      } else {
        options.onError(null, 'Upload error: ' + xhr.status);
      }
    };
    xhr.onerror = function() {
      return options.onError('XHR error', file);
    };
    xhr.upload.onprogress = function(e: any) {
      var percentLoaded;
      if (e.lengthComputable) {
        percentLoaded = Math.round((e.loaded / e.total) * 100);
        return options.onProgress({ percent: percentLoaded });
      }
    };
  }
  // xhr.setRequestHeader('Content-Type', file.type);
  if (options.contentDisposition) {
    var disposition = options.contentDisposition;
    if (disposition === 'auto') {
      if (file.type.substr(0, 6) === 'image/') {
        disposition = 'inline';
      } else {
        disposition = 'attachment';
      }
    }

    var fileName = options.scrubFilename(file.name);
    xhr.setRequestHeader('Content-Disposition', disposition + '; filename="' + fileName + '"');
  }
  if (signResult.headers) {
    var signResultHeaders = signResult.headers;
    Object.keys(signResultHeaders).forEach(function(key) {
      var val = signResultHeaders[key];
      xhr.setRequestHeader(key, val);
    });
  }
  if (options.uploadRequestHeaders) {
    var uploadRequestHeaders = options.uploadRequestHeaders;
    Object.keys(uploadRequestHeaders).forEach(function(key) {
      var val = uploadRequestHeaders[key];
      xhr.setRequestHeader(key, val);
    });
  }
  return xhr.send(file);
};
