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
import { UploadParamsSchema } from './upload.schema';

export const PickerParamsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack Picker',
  description: 'Filestack Picker Options',
  type: 'object',
  additionalProperties: false,
  // required: ['container'],
  properties: {
    allowManualRetry: {
      type: 'boolean',
    },
    accept: {
      additionalProperties: false,
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
          minItems: 1,
          items: [
            {
              type: 'string',
            },
          ],
        },
      ],
    },
    acceptFn: {
      format: 'callback',
    },
    websearch: {
      type: 'object',
      properties: {
        predefinedText: {
          type: 'string',
        },
      },
    },
    fromSources: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
            enum: [
              'local_file_system',
              'url',
              'imagesearch',
              'facebook',
              'instagram',
              'googledrive',
              'picasa',
              'unsplash',
              'dropbox',
              'webcam',
              'video',
              'audio',
              'box',
              'github',
              'gmail',
              'googlephotos',
              'onedrive',
              'onedriveforbusiness',
              'clouddrive',
              'customsource',
              'tint',
            ],
          },
          {
            type: 'object',
          },
        ],
      },
    },
    container: {
      format: 'HTMLContainer',
    },
    cleanupImageExif: {
      oneOf: [
        {
          type: 'boolean',
        },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            keepOrientation: {
              type: 'boolean',
            },
            keepICCandAPP: {
              type: 'boolean',
            },
          },
        },
      ],
    },
    displayMode: {
      type: 'string',
      enum: ['inline', 'overlay', 'dropPane'],
    },
    concurrency: {
      type: 'integer',
      minimum: 1,
      maximum: 20,
    },
    supportEmail: {
      type: 'string',
    },
    customSourceContainer: {
      type: 'string',
    },
    customSourcePath: {
      type: 'string',
    },
    customSourceName: {
      type: 'string',
    },
    disableStorageKey: {
      type: 'boolean',
    },
    disableTransformer: {
      type: 'boolean',
    },
    disableAltText: {
      type: 'boolean',
    },
    disableThumbnails: {
      type: 'boolean',
    },
    exposeOriginalFile: {
      type: 'boolean',
    },
    globalDropZone: {
      type: 'boolean',
    },
    hideModalWhenUploading: {
      type: 'boolean',
    },
    imageDim: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        {
          type: 'integer',
          minimum: 1,
        },
      ],
    },
    imageMax: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        {
          type: 'integer',
          minimum: 1,
        },
      ],
    },
    imageMin: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        {
          type: 'integer',
          minimum: 1,
        },
      ],
    },
    imageMinMaxBlock: {
      type: 'boolean',
      default: false,
    },
    lang: {
      type: 'string',
      enum: ['ca', 'da', 'de', 'en', 'es', 'fr', 'he', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt', 'sv', 'ru', 'vi', 'zh', 'tr', 'ar'],
    },
    minFiles: {
      type: 'integer',
      minimum: 1,
      maximum: 1000000,
    },
    maxFiles: {
      type: 'integer',
      minimum: 1,
      maximum: 1000000,
    },
    maxSize: {
      type: 'integer',
      minimum: 1,
    },
    modalSize: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        {
          type: 'integer',
          minimum: 1,
          maximum: 1000000,
        },
      ],
    },
    rootId: {
      type: 'string',
    },
    startUploadingWhenMaxFilesReached: {
      type: 'boolean',
    },
    uploadInBackground: {
      type: 'boolean',
    },
    videoResolution: {
      type: 'string',
    },
    onCancel: {
      format: 'callback',
    },
    onClose: {
      format: 'callback',
    },
    onOpen: {
      format: 'callback',
    },
    onFileSelected: {
      format: 'callback',
    },
    onFileUploadCancel: {
      format: 'callback',
    },
    onFileUploadStarted: {
      format: 'callback',
    },
    onFileUploadFinished: {
      format: 'callback',
    },
    onFileUploadFailed: {
      format: 'callback',
    },
    onFileUploadProgress: {
      format: 'callback',
    },
    onUploadStarted: {
      format: 'callback',
    },
    onUploadDone: {
      format: 'callback',
    },
    onFileCropped: {
      format: 'callback',
    },
    storeTo: {
      additionalProperties: false,
      type: 'object',
      properties: {
        filename: {
          type: 'string',
        },
        location: {
          $ref: 'locationsDef',
        },
        container: {
          type: 'string',
        },
        path: {
          type: 'string',
        },
        region: {
          type: 'string',
        },
        access: {
          type: 'string',
          enum: ['public', 'private'],
        },
        workflows: {
          $ref: 'workflowsDef',
        },
      },
    },
    viewType: {
      type: 'string',
      enum: ['grid', 'list'],
    },
    transformations: {
      type: 'object',
      additionalProperties: false,
      properties: {
        config: {
          type: 'object',
        },
        circle: {
          type: 'boolean',
        },
        rotate: {
          type: 'boolean',
        },
        force: {
          type: 'boolean',
        },
        crop: {
          oneOf: [
            {
              type: 'boolean',
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                force: {
                  type: 'boolean',
                },
                aspectRatio: {
                  type: 'number',
                },
                autoCropArea: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                },
              },
            },
          ],
        },
      },
    },
    customText: {
      type: 'object',
      patternProperties: {
        '.*': { type: 'string' },
      },
    },
    cropFiles: {
      type: 'array',
      minItems: 1,
    },
    loadCss: {
      type: 'string',
    },
    failOverMaxFiles: {
      type: 'boolean',
    },
    dropPane: {
      type: 'object',
      properties: {
        cropFiles: {
          type: 'array',
          minItems: 1,
        },
        customText: {
          type: 'string',
        },
        disableClick: {
          type: 'boolean',
        },
        overlay: {
          type: 'boolean',
        },
        showIcon: {
          type: 'boolean',
        },
        showProgress: {
          type: 'boolean',
        },
        onDragEnter: {
          format: 'callback',
        },
        onProgress: {
          format: 'callback',
        },
        onDragLeave: {
          format: 'callback',
        },
        onDragOver: {
          format: 'callback',
        },
        onDrop: {
          format: 'callback',
        },
        onSuccess: {
          format: 'callback',
        },
        onError: {
          format: 'callback',
        },
        onClick: {
          format: 'callback',
        },
      },
    },
    errorsTimeout: {
      type: 'number',
      minimum: 0,
    },
    customAuthText: {
      type: 'object',
      patternProperties: {
        '.*': {
          additionalProperties: false,
          type: 'object',
          required: ['top', 'bottom'],
          properties: {
            top: {
              type: 'string',
            },
            bottom: {
              type: 'string',
            },
          },
        },
      },
    },
    uploadConfig: {
      type: 'object',
      additionalProperties: false,
      properties: {
        // manual import upload definitions
        ...UploadParamsSchema.properties,
        tags: {
          type: 'object',
          additionalProperties: {
            anyOf: [
              {
                type: 'string',
              },
              {
                format: 'callback',
              },
            ],
          },
        },
      },
    },
    useSentryBreadcrumbs: {
      type: 'boolean',
    },
    transformationsUI: {
      type: 'boolean',
    },
    pasteMode: {
      type: 'object',
      additionalProperties: false,
      properties: {
        pasteToFirstInViewPort: {
          type: 'boolean',
        },
        pasteToFirstInstance: {
          type: 'boolean',
        },
      },
    },
    disableDirectoryUpload: {
      type: 'boolean',
    },
    miniUploader: {
      type: 'boolean',
    },
    multipleFileUpload: {
      type: 'boolean',
    },
    googleDriveAppID: {
      type: 'string',
    },
  },
};
