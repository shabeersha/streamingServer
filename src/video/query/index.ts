import { FindVideoHandler } from './find-video/find-video-handler';
import { GetVideosHandler } from './get-videos/get-videos.handler';

export const VideoQueryHandlers = [GetVideosHandler, FindVideoHandler];

export * from './get-videos/get-videos.query';
export * from './find-video/find-video.query';
