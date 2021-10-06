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
import * as Path from 'path';

import { getFile } from '../src/lib/api/upload';
import { S3Uploader } from './../src/lib/api/upload/uploaders/s3';
import { Client } from './../src/lib/client';

// import * as Sentry from '@sentry/node';

const createFile = (size = 10 * 1024 * 1024) => Buffer.alloc(size).fill('a');
// Sentry.init({ dsn: 'DSN' });

const fs = new Client(process.env.API_KEY);
// fs.on('upload.error', (e) => {
//   console.log('uploadError', e);
// });

(async () => {
  const file1 = createFile(5 * 1024 * 1024);
  const file2 = createFile(2 * 1024 * 1024);

  fs.multiupload(
    [ { file: file1, name: 'test1' }, { file: file2, name: 'test 2' } ],
    {
      onProgress: (e) => {
        console.log('prog', e);
        if (e.files) {
          Object.keys(e.files).forEach(f => console.log(e.files[f]));
        }
      },
    }
    // {
    //   filename: () => 'test2.mp4',
    // }
  ).then(res => {
    console.dir(res, { depth: null });
  });
})();

// try {
//   fs.upload('./upload.js').then((res) => {
//     console.info('Upload done!', res);
//   });
// } catch (e) {
//   console.log(e.details);
// }

// const b64jpg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAlgCWAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A4iLw5ozW+ms1wSs2DLc/2jCu9/LZvJ8krvh+cCPzXJQffxtIFZes6dodvLeRyXN7bXEY/cW8Xk30bfICN1wkiDlic7UO0epBFW2t1x90flWNqcOSrKPqK4YV1JnTKnY35fDPhQavcRWOqvd28VxcwRwy3cEDXBjaPawmOUjQrI2GYEP5BxgyBUzrLR/Db61b2l1qd7a+ZfpDNHsheGKIyhSftQkwcJk7/L2kj05rBjt2cMuCGJzShJkKybQFHB3DrXSppmLieheGNJ8JNq2lXl1qaSWReGRoLyRIto850Yy/K4IPlofK67Zxl9qM54GyC+W4JHWthrOO40wvbKN4GWi6n6r6j26j9a5hllAbaGxntV0/eQ2rGqWiSBzuHykZx6c//WrFk2NPuUk5armlIZ5Z7c8mWFto/wBofMB/47j8aospV1z61oo2Iua9iOXHvS3Q/cz06wGXeppIfO85PWpGjADFTwacZ3IxmtVNJjHLAn61MLWCLsg+tLlLczDVJHPCsfwqVbOd+iY+tbAaBf4gf90VYidEQ3HkswB2oCPvN/gOv5etPlFzlFomhsVjb73GasKvyimSCefAMe0bskk1ZCYFDI3ICKYwqwUqNgKQEBHNFPIGeaKAPRNP8IaxqsAmtbMmI9HY7Qah1D4b+IlVnaxJH+wwNe86Ld29zpcElqyGMoNu2tNWyOcV8/TcmrpnoTkk7WPj7UdOuNOuAjxOkqHlXGDXrmj2+nR+EbUPpUF35sI3I0KuXYjOSTz1zjFdJ8UtGsZtD+3vGiTwsNrjqQT0rB0LNzpGmzQlc2rmJh7ZyP513YWtzy5JbmNWHu8yOf1DwvZXYB0XNpeZ4tGfgsOfkb+E+x/SuTvLD7QJIGi8rUBkNGE2+Zjrgdn9R37e/s19oubySVp2aC5TbsT5QGwec549upNczq2hyXseLzZ9ojwsV0fl3AdFbHp2bt3ruV4PQwfvbnjtpHHZ3cVxGrM0bhwPXBzU+oacsOoSpDFuj3bomP8AEjfMp/FSK6vVdMlbzJXjKXceWmBGPNX++PccbseoboTWdcKr2VrMM5AMT5Pden6ED8KvmYuUx7O1kjZmfAz2FSyWrmQsshUH0q2BTWmjQ4Zhmi4WRWFiD96Rz+NPFjCP4c/WpPtcPTk0G8iA707isiW2sVnnWNFVRyzMRwqgZJP4U64ZZZAI12xINsan09T7nqfrTri9WysEgC/vroCSXPVU6ov4/e+m2ug0fw+kFvHqOuRlEfHkWWdry56Fu4X260N2AoaN4Zu9ZBm3pbWakhriXpnuFHVj7CtHXvCthpmiLe2l9LJICAyzIF3c/wAIB469DXSPY3M2oLDPKqSMNqRxqVjiX+FQCODj2HfrWL40nW001LFpVb94AmDk4A5OfrS1GcGwqIipGkT+8KjLr/eFMRGRzRSllJ6iigR6Np2vahpBxaXDIn9w8rWp/wALP1eB9rCBuO+RXF/2zbvaRh2G8H0rkdSE8mqGWJyY8gj5q8Wng+aT5tD0J1klpqeja14q1LxPEILuUJFuz5acA11PgeWGKQ6dJyk6cEn+Ic/yzXm9rdwiNd7KGxW7p2tQWVxb3CzDdFIr8Hrg9KUKcqdRNLZjclKLTPcbu1jmijYIMKP3eDjJ/KsbVdIur6IIHXMY3CNQQC2OM9K6KwuoriySaMhonUPGw/ukZFZOraisNu0KFo5H48zd3PHHvXtPU4DkYdE1G9lSynijbZh1mzkwn+7+R6dCM+tQzeCNC0OSRL+eSRZm82OFQBsPPAz1GDj8B3rp/DdnqFjI8l3OlxHI/V0O+MenPPfv+nFZPi7wpqt5rmm32muZLRXUzR78FSMcgHt7UJcoXuTat8PfD0do16YZIy20lFfHyn0GOOo/LHeuL1X4b2EesS2iTtGo3FGBLEkhdq4+pP5V6jqd2l9GLKZCTMyx4HB3D5vyG2oLqHzbndJGRE3AaQAkE8fXOQP84p7gcdbfCfQ3urVBPOS0XnSfOMHoMAHkDOevuKfrHw58MQXccbyz2gUDgDcHBP5+1dZcXcVpqMcrKftCqIic4yv8j0PT16VhfEWGWaysLuzhM04nVCEUsz8cDj8ee1FxHLL4KudG1aTVLmGO+mnkzad0TPIYjuQCMA8DHtXT6bo9wzPc6mFW6AH7xQOeT+P5Vv38NxH4bxNFvm8kEhWAKnHT3I/nWXot7MwSDU0JkVB5RYDIB9ecg8daTXUZej0yC18yfDLPIm3Oc7h/UivBvGF39p8R3MaNmK3byU79Op/E5r3bxPqa6Z4bubyPLeREXAbn5ug/UivnCVjJIzscsxJJ9SabEV2qJs1ORTGWkIrkt60U8jmigDQmiZMkkelVyT60PMZG3E5oyM9aSTtqNtdBsjOIztPNZ7zzYwWIrT49arXEAYbh1707Bc+hPAOoXr/DjSnjuBJJKWQbgD5aqcY/Ssb4h+Krm0sYbLTg/wBomYBZlTpnqEOOtcn8O3uGs3s57yWOyLLII1OC2SQQvPGdvJ+tex6np9lrtvpN/pVvHINKnD/ZVAGY8YIHbI4I+mKiTbZXQ8BtdA8UyOlwst1ahnA8+ScxIpJwCWJAFeg+GvG/iLwvrtto3ih3uLaZlSK7YgqynoQ4+8ORzk16Zqeh6V4o05rN/ntHKlolG1gQwbBBGRyMdKofEODRZPB9xa38UPmqgW3VQN0bDG3Hpj+VSql9LEamv4mtVhsVvUUMC2CM46ggc49cfnWbaylrNTsUgYAZm3Yx0wce5/SsHT/GE2reFrcXMDKsSqodiD5xAxux7mqgE18CxklGGABUkHPHHFU6qjuWotmiwfUfFVnDuZNrFMqTyMnGeMZ4JH1q58Q/GEHgLSYljgW4v7n5YVboMdz649PesGC+Ol6hBdtIRIrbt57DPIP1pBHpnj/4l+bq8bIun2yiGymxiRick/7Q/nS9omriaaPPNY8efEWGW2uL24ksUnXzoENuoDLxzyMkdPzq94Q8ezXGotbashaaYn99EQuSfUZA7dulepX3gCwm8WTaxGqlJoFia1dAUBBHzL6cKBiuftfA2jP8RBNZQI1haW7/AGsgfuxKeij3HX2oVVN2iJX6mJ8TNSvpPBEbpIqqbwQS4GDIACRx0HTNeUw7vKG/rXf/ABVhktdQt7KK683T0fKJuzhtvQ+uASB+NcFnHatFsD3Aio2pzNTCaYhhFFBaikIis2Vsxhtzdau+URyVOKqQItu28Kc+tWm1AbcEjHvUSm09i1FMcIwaDEMHFQpqscUgJjEg7rWnN9nlso7qFCgfqhPSk6vLa6GoX2NvQbSG2gW8niM0buvkxrnl1BLAHp6/jiu8ttVEcguoJII5ZF8xSj4Vs8YY5GOOBwT1rivD1/a2/hydbmF2RJQyAHkH1H/162LbU7XV7z7LFZG0gmmD73lBAHfjOPwPTk4607X2DY7iw8W3LyCLVLCwuBHlAzyAvkcYyeufXiquv3c+v7VW1isrK3OSijl2X6DG3jj1xRcxQaXaebBA7xrGTiJQxJB4zznt+gq9ZSjVYUjkiMMhjBa3YZZQRwDz/nFTN8qHFXZzK3ICwQECKFPmjC8BV5Vce+O/vXX6cLcQjOGDDpnqe/X/ADxXC+LrWfw3NJdXNlLqOnDiDymZTG3dZCOcccHp1rU8J6noOvaN9shgktfLO2WESEbWH0xn61zSV1zSNo72Rq+Kfsy25YHDfdB6D/PBP4Vx9v5ktzbTxqGuLZgQWwPMVSSV9+OmfSneO9Y0DSrqCxazmu7p8PhJWBRT6nkn6Vq+H9IuRo6X91m3jYk28LLh/L7Fvr6fSnH3VzIUld2OvbxXor2GfJunPl5dWc4HsQW/+tWNf6/JPZxxWskdvaqCfLtkUAAYHXPHPt/Wqbz2kbuPNiiWY4KHAyQenJ9uwya5HW3exZ5FjMhxgBo9zHg5X268HORn8uleRjsYPikefKlwTvdf3rsWyHB6Fceg9h071g4yK0Ly4iurMTiWZyzhcMu0RqOi4HHFUQ69jWiViWRMtRlanYAntUTkLyTQLciK0U4Op6GigLGaFuZj944+tamn6LFOd1xMcegrP+0BOlNa9mYYViBWc1OStF2LjZbnXoug6YmTGjuO7cmsfUtahuTshQIg6YFYaq0rct+JqyUgteWHmyDop4UfX1+lZU8Kk+aTbZcqraslY3fD19qEblLdJWic8b/uZ78HitW5huLXU4LpZIhukCsqFZD/AN8Dn865T+1tSlG1ZiiHgqmI1I9OMZFdJosF+jR3BiaLn93KfkGfYnlj7KDXVbsZXPQ7u40G3tY8a1qMhWZRmKPBDgfd4HAPHerGm6np8GqXD21veveMVWSSXkgdNuOuKzre+1G5VIrvXNNjwQyK0TbuD3BHP5ZroLO/uyDt1+wyz4UKuzKjqDj/ADxWEk+pojurKQXkCs0Lop+8pXggcfT/ACK8Y8dJdeD9bvbW1tUhsr2RZ4pVXAY4GRx6V6C97qfnND/a0aqCCpiQszDuDnpXNeKZ4dTtktbl3aJGDDztpYNk8H8uOvWrgk9GhO61RpfDjTV1kXXiq/0+Nbh8RW7uoYhVHJGemT/KtTxXqltBZFblZIlzg+SMk59Mf/rHNV9G1adNPitYb6OFo4/LAMf7sY6c9uO35UXt5e3SuspsJNg6u3O89iMcA/1pVErWCPdnCwxaPNHp1vb6zCyi4JP2iHJZu4ww4Oe4rnvGk2p2V6unSmK4MoEqTQSFlxyMAEcEV192klu/mnS9OkEYYyxIeUYnJAA5B/P8K43UNNtbu786DShFahMCOQls46kOhwOvQ9KcEJmDidbdY5Y2jB5AYYzURXFabi2i/dokkQP8JO5D/wDW/OqtxEnRSUz0Ocqfx/z+FNzSKVKTKwTIzk1WlhfOc5FXWjZI9vcUxuRmuZ1JNnVGmorQzJAVbAoqdwCeaK1UiOUzKcBTN2OlPRiR71uclyRTsBfuOF+tT2tk9wBJK5SL17t9P8TwKjQITvk5jTjH94+lX43eT5pF6YxGo79h/gO3WmhMv2rW9ggljjWMngPje7H0Hf8ALGfpWnBLuL3WoS+Ui8Mhclsf3WI5P+4uP9o565cClS88mWkX5SY+oP8Acj9/Vvy9asf2Te6jIhuikEQ6RrwF9gPQf4nvVXEX28RyXw8u1t0gijP+scDLD0JHT6L2HeprXxY1mplRVJB/1axqqsT3IqjfQW1jY+VCM8Y3H07/AJ8flXOyv5LLJ1JHyj+tQ9dykdhP41128jEMACJncT1P0+lUv7L1/XGDyXhxkkZ4ycFs4/Sm6JfW4CLKFwDli38vc12qa7p8MbK0e2bGVX0xgZ/T9a0irhY45tR8Q+H32m4ZiMZLDnAzxn+tWG8cXN805nt03qAQxPU5wD9f8KseI9dtriOJFiARgc5AJTnnHtz09MVwskghuQGGVUg/KfxGPapl2Gjcm1qe8kEyAKpbMpUkMT2NaUGqShgySbH7YOA359D7Hj6d+QtpjFcgjkMeR61qF9pKg8dRWNSTjsdFBJ7nQTX1tdgi7gAJ6zRjDA/7S9/r1rPntGgXcrCWBujryP8A61VoZvMwrH5ugPr7H/PtU0U727sB90/eQ9DWE5J7nTFdis+V6cjtUT8rkdauzxoV8yL7ucFT1U1QkyMkd6ytZjbIWQMfeinDp15oq7kWMNV3NirdvEhfY2ee4qO1tpbmTbEjM3oBW/aeHL3YC0eCRzzXfoeZrczYog0irFhmBwvoP/r10WnaNAMNcXcacHAB5A/ib6npVS30G5t5dpiYdsjnA9asrYXEYkCxH525PsOg+n+FJIq5pi6023AS32hY+FA5IFVZtYi5xuYnge1Zz6ddCQlI2HqaU2Eo5ZQPxpNgVdS1E3DFVQhM4BrMlJbaB1PFaF1CyEFsYz2rOuFIHHbpSAdczFZwIGxHGAq47+p/OlW7faxZ2LFQBk9ORVEEEdcEU0uelGpehce7eQAO2SGJyfp/9aoJ8AqQ4ZSMgjt7Gq+aUHtTsTzE8bEuuOx5NaqtvQE9RxWVGRkDPfoK0ImxWNQ6aKLcdWyfMTP8S9fcVSjarCNtO6uV7nXFCiXYd3UYwR6ioZgM5XlWGQae645/hPIqPO4FfxH1prsJsgPB5ooYZoqidDsrOxtrCPZBEF9W7mraOeVyc+tNS3u2Fq32WcpdsVtiImxMQcEJx8xBIGB3NMl/0ed45A8cqMVkjdSCrDgqQeldbPNLkeSM5yT0+lNfLciooZPNjkKBysS73ZVJCLkDJ9OSB9SKdcubeWSGVXSWNiro6kMpHBBB6GkxlaUk9eKoS7SCK0b6KWzuHt7yGW3nTG6KaMoy5GRkEZ6EGsyVkB4b6ZoAydQjzC2BnFYMsu0Feo6V1FzC5gExjcQuzIshU7WYAEgHuQGXI9x61hzwxKSSuSTxTQjJO0n0pvHNaM2l3fkfaBaTeV5fn7/LO3y9/l78/wB3f8uemeOtU4rae4kMcMLyuEZysaliFVSzHjsFBJPYAmqAhopdp9KcsZOeKYiWPAIP9KuxnnFTX2gaxpHkjVdKvbAS58v7VbvFvxjONwGcZH5iolXaBjNY1DppNosIcCpGLbflqJBj3qdcYrlZ1JNj1ctGVP1H1qA8NkGlVjz7GkYjkiga1Gv1z60U0tnj0oqiLHo93rVlfafHbn7RG07Wn2kiNWEQt4jCCnzDeWDbsHbgjGTnI0JfEehyX2uTfYpZvt8tzJG81vEWBkQlM53FPLcnlCC27JI2BSUV2Hnmb4a1uLRLm6meF5TLEkaqpAziaNz83VTtRsMOVOCMEZFfS7yDS/EtlelpZbS1u45s7AHZFcH7ucA4HTP40UUhm7B4l0MLE1zpaI8Nj9nSKO2WZVbzZZPkaZ3CA7kyzI5+8AF74er6jo154d060s7H7PewY85jAMscYYiUMCwJCttZCVJYBtuBRRTER22tabD4Qk0u6heWYTTyJGbaMqTJHGqMJSd8ZRk3EKMPgKeCaZ46s7SzsdG2afDa3moRvqsnkMGj2ThNiL8qlVUo+EO4KG4ZsnBRQA228exweEIPDV3DNdaTHaqJbLCosswvRMT5g+dVMWUyOhPTvWRHrnht9fnmuYH+xy6bNaySx6TbhppnDBJRAHCQFNyco2T5WeDI2CimBVbxHor6lpw/sK0SztreFXkW3HmmcW4jeVlLbJR5gD7GwreWM7TJIW6vT/h5e/E6W68Q+Gl07TtPDRWxt7k+UwlSCLzDiKPZgsScgLnJO1elFFAIyofGOkXvxF1LXNV01JrKZ5jaqLKHMeZC6NLFwsxIJVtzbsMSHDKpBd6v4am8KXFhZ6Z5N8bppI5jag7l35Uq/m74/kYqY2MqnYpBDFmJRWUzeJzIFPJwKKK5DsQz+En1qMtzRRVIQxutFFFWSf/Z';

// (async () => {
//   // const file = await getFile(createFile());
//   const file = await getFile(b64jpg);
//   // file.name = 'test.txt';
//   console.log('Uploadinf file', file.size);
//   // const token = new FsCancelToken();

//   const u = new S3Uploader({});
//   u.setUrl('https://upload.filestackapi.com');
//   u.setApikey(process.env.API_KEY);
//   // u.setIntegrityCheck(false);
//   u.addFile(file);
//   // u.addFile(file1);

//   // setTimeout(() => {
//   //   console.log('abort call');
//   //   u.abort();
//   // }, 3000);

//   const res = await u.execute().catch((e) => {
//     console.log('ERROR', e);
//   });

//   console.log(res);
// })();
