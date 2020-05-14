/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Session } from '../client';
import { Hosts } from './../../config';
import { Map } from './extensions';
import fileType from 'file-type';
import * as isutf8 from 'isutf8';

// more info https://gist.github.com/AshHeskes/6038140
const extensionToMime = {
  'text/vnd.dvb.subtitle': 'sub',
  'application/x-msmetafile': 'wmz',
  'application/x-msi': 'msi',
  'application/x-ms': 'ms',
  'application/atom+xml': 'atom',
  'application/json': ['json', 'map', 'topojson'],
  'application/ld+json': 'jsonld',
  'application/rss+xml': 'rss',
  'application/vnd.geo+json': 'geojson',
  'application/xml': ['rdf', 'xml'],
  'application/javascript': 'js',
  'application/manifest+json': 'webmanifest',
  'application/x-web-app-manifest+json': 'webapp',
  'text/cache-manifest': 'appcache',
  'image/x-icon': ['cur', 'ico'],
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.debian.binary-package': 'deb',
  'application/font-woff': 'woff',
  'application/font-woff2': 'woff2',
  'application/vnd.ms-fontobject': 'eot',
  'application/x-font-ttf': ['ttc', 'ttf'],
  'font/opentype': 'otf',
  'application/java-archive': ['ear', 'jar', 'war'],
  'application/mac-binhex40': 'hqx',
  'application/octet-stream': ['bin', 'deb', 'dll', 'dmg', 'img', 'iso', 'msi', 'msm', 'msp', 'safariextz'],
  'application/postscript': ['ai', 'eps', 'ps'],
  'application/rtf': 'rtf',
  'application/vnd.google-earth.kml+xml': 'kml',
  'application/vnd.google-earth.kmz': 'kmz',
  'application/vnd.wap.wmlc': 'wmlc',
  'application/x-7z-compressed': '7z',
  'application/x-bb-appworld': 'bbaw',
  'application/x-bittorrent': 'torrent',
  'application/x-chrome-extension': 'crx',
  'application/x-cocoa': 'cco',
  'application/x-java-archive-diff': 'jardiff',
  'application/x-java-jnlp-file': 'jnlp',
  'application/x-makeself': 'run',
  'application/x-cd-image': 'iso',
  'application/x-opera-extension': 'oex',
  'application/x-perl': ['pl', 'pm'],
  'application/x-pilot': ['pdb', 'prc'],
  'application/x-rar-compressed': 'rar',
  'application/x-redhat-package-manager': 'rpm',
  'application/x-sea': 'sea',
  'application/x-shockwave-flash': 'swf',
  'application/x-stuffit': 'sit',
  'application/x-tcl': ['tcl', 'tk'],
  'application/x-x509-ca-cert': ['crt', 'der', 'pem'],
  'application/x-xpinstall': 'xpi',
  'application/x-ms-dos-executable': 'exe',
  'application/xhtml+xml': 'xhtml',
  'application/xslt+xml': 'xsl',
  'application/zip': 'zip',
  'text/css': 'css',
  'text/csv': 'csv',
  'text/html': ['htm', 'html', 'shtml'],
  'text/markdown': 'md',
  'text/mathml': 'mml',
  'text/plain': 'txt',
  'text/vcard': ['vcard', 'vcf'],
  'text/vnd.rim.location.xloc': 'xloc',
  'text/vnd.sun.j2me.app-descriptor': 'jad',
  'text/vnd.wap.wml': 'wml',
  'text/vtt': 'vtt',
  'text/x-component': 'htc',
  'application/x-desktop': 'desktop',
  'text/x-markdown': 'md',
  'application/x-typescript': 'ts',
  'application/x-java-archive': 'jar',
  'application/x-sharedlib': 'so',
};

/**
 * Resolve cdn url based on handle type
 *
 * @private
 * @param session session object
 * @param handle file handle (hash, src://alias, url)
 */
export const resolveCdnUrl = (session: Session, handle: string): string => {
  const cdnURL = session.urls.cdnUrl;

  if (handle && (handle.indexOf('src:') === 0 || handle.indexOf('http') === 0)) {
    if (!session.apikey) {
      throw new Error('Api key is required when storage alias is provided');
    }

    // apikey is required for alias or external sources call
    return `${cdnURL}/${session.apikey}`;
  }

  return cdnURL;
};

/**
 * Resolve all urls with provided cnames
 *
 * @private
 * @param urls
 * @param cname
 */
export const resolveHost = (urls: Hosts, cname: string): Hosts => {
  if (!cname) {
    return urls;
  }

  const hosts = /filestackapi.com|filestackcontent.com/i;

  Object.keys(urls).forEach(key => {
    urls[key] = urls[key].replace(hosts, cname);
  });

  return urls;
};

/**
 * Removes empty options from object
 *
 * @private
 * @param obj
 */
export const removeEmpty = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(k => !newObj[k] && typeof newObj[k] !== 'boolean' && delete newObj[k]);
  return newObj;
};

/**
 * Returns unique time
 */
let last;
export const uniqueTime = () => {
  const time = Date.now();
  last = time === last ? time + 1 : time;
  return last;
};

/**
 * Generates random string with provided length
 *
 * @param len
 */
export const uniqueId = (len: number = 10): string => {
  return new Array(len).join().replace(/(.|$)/g, () => ((Math.random() * 36) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']());
};

/**
 * Check if input is a svg
 *
 * @param {Uint8Array | Buffer} file
 * @returns {string} - mimetype
 */
export const getMimetype = (file: Uint8Array | Buffer, name?: string): string => {
  let type = fileType(file);

  if (type && ['text/plain', 'application/octet-stream', 'application/x-ms', 'application/x-msi'].indexOf(type.mime) === -1) {
    return type.mime;
  }

  if (name && name.indexOf('.') > -1) {
    const ext = name.split('.').pop();
    const keys = Object.keys(Map);
    const mapLen = keys.length;

    for (let i = 0; i < mapLen; i++) {
      if (Map[keys[i]].indexOf(ext) > -1) {
        return keys[i];
      }
    }
  }

  try {
    if (isutf8(file)) {
      return 'text/plain';
    }
  } catch (e) {
    /* istanbul ignore next */
    console.warn('Additional mimetype checks (text/plain) are currently not supported for browsers');
  }
  // this is only fallback, omit it in coverage
  /* istanbul ignore next */
  return 'application/octet-stream';
};

/**
 * Sanitizer Options
 */
export type SanitizeOptions =
  | boolean
  | {
    exclude?: string[];
    replacement?: string;
  };

/**
 * Sanitize file name
 *
 * @param name
 * @param {bool} options  - enable,disable sanitizer, default enabled
 * @param {string} options.replacement - replacement for sanitized chars defaults to "-"
 * @param {string[]} options.exclude - array with excluded chars default - ['\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']
 */
export const sanitizeName = (name: string, options: SanitizeOptions = true): string => {
  if (typeof options === 'boolean' && !options) {
    return name;
  }

  let ext;

  const replacement = typeof options !== 'boolean' && options.replacement ? options.replacement : '-';
  const exclude = typeof options !== 'boolean' && options.exclude ? options.exclude : ['\\', '{', '}', '|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>'];

  if (!name || name.length === 0) {
    return 'undefined';
  }

  const fileParts = name.split('.');

  if (fileParts.length > 1) {
    ext = fileParts.pop();
  }

  return `${fileParts
    .join('.')
    .split('')
    .map(char => (exclude.indexOf(char) > -1 ? replacement : char))
    .join('')}${ext ? '.' + ext : ''}`;
};

/**
 * Filter object to given fields
 *
 * @param toFilter
 * @param requiredFields
 */
export const filterObject = (toFilter, requiredFields: string[]) => {
  if (!requiredFields || requiredFields.length === 0) {
    return toFilter;
  }

  if (Object.keys(toFilter).length === 0) {
    return toFilter;
  }

  return Object.keys(toFilter)
    .filter(f => requiredFields.indexOf(f) > -1)
    .reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {});
};

/**
 * Deep cleanup object from functions
 *
 * @param obj
 */
export const cleanUpCallbacks = (obj: any) => {
  if (!obj || Object.keys(obj).length === 0) {
    return obj;
  }

  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'function') {
      obj[k] = undefined;
    }

    if (obj[k] === Object(obj[k])) {
      obj[k] = cleanUpCallbacks(obj[k]);
    }
  });

  return obj;
};

export * from './index.node';
