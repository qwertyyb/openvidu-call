import assert = require('assert')
import path = require('path')
import FormData = require('form-data');
import fs = require('fs')
import { Recording } from 'openvidu-node-client'
import { RECORDING_PATH, RECORDING_UPLOAD_URL } from '../config'
import { RetryOptions, logger } from '../utils';
import axios, { AxiosResponse } from 'axios';

export enum WebhookEvent {
  recordingStatusChanged = 'recordingStatusChanged'
}

export interface WebhookBody {
  event: WebhookEvent,
}

/*
{
  "sessionId": "daily-call",
  "uniqueSessionId": "daily-call_1704772554782",
  "timestamp": 1704772568490,
  "startTime": 1704772555616,
  "duration": 9.6,
  "reason": "automaticStop",
  "id": "daily-call~1",
  "name": "daily-call~1",
  "outputMode": "COMPOSED",
  "resolution": "1280x720",
  "frameRate": 25,
  "recordingLayout": "BEST_FIT",
  "media_node_id": "media_HaIUrIWg",
  "hasAudio": true,
  "hasVideo": true,
  "size": 30987,
  "status": "ready",
  "event": "recordingStatusChanged"
}
*/
export interface RecordingStatusChangedBody extends WebhookBody {
  status: Recording.Status,
  sessionId: string,
  id: string,
  startTime: string,
}

export class UploadService {
  static getBedNoFromSession = (sessionId: string) => {
    return sessionId.split('-')[0]
  }
  static getVideoPathFromRecording = (recordingId: string) => {
    return path.join(RECORDING_PATH, recordingId, recordingId + '.mp4')
  }
  upload = async (recording: RecordingStatusChangedBody, retryOptions = new RetryOptions()) => {
    while(retryOptions.canRetry()) {
      const { sessionId, startTime } = recording
      const videoPath = UploadService.getVideoPathFromRecording(recording.id)
      const bedNo = UploadService.getBedNoFromSession(sessionId)
      const recordTime = new Date((Number(startTime))).toLocaleString('zh-CN', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-')

      assert(fs.existsSync(videoPath), `${videoPath} is not exists`)
      
      assert(RECORDING_UPLOAD_URL, 'recording upload url is required')

      const form = new FormData()
      form.append('video', fs.createReadStream(videoPath));

      const url = new URL(RECORDING_UPLOAD_URL)
      url.searchParams.set('bed_no', bedNo)
      url.searchParams.set('record_time', recordTime)
      const uploadUrl = url.href.replace(/\+/g, '%20')
      let response: AxiosResponse = null
      console.log(`upload url: ${uploadUrl}`)

      try {
        response = await axios.post(uploadUrl, form);
      } catch (err) {
        logger.error(`${videoPath} upload failed: ${err.message}`)
        await retryOptions.retrySleep();
        continue
      }
      if (response.status === 200) {
        let json: any = response.data
        if (!json.result) {
          logger.error(`${videoPath} upload result failed: ${json}`)
          await retryOptions.retrySleep();
          continue
        }
        logger.info(`upload ${videoPath} success: ${JSON.stringify(json)}`)
        return true;
      } else {
        logger.error(`${videoPath} upload failed statusCode: ${response.status}`)
        await retryOptions.retrySleep();
        continue
      }
    }

		throw new Error('Max retries exceeded while upload recording');
  }
}