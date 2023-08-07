import { CreateVideoHandler } from './create-video/create-video.handler';
import { EditVideoHandler } from './edit-video/edit-video.handler';

export const VideoCommandHandlers = [CreateVideoHandler, EditVideoHandler];

export * from './create-video/create-video.command';
export * from './edit-video/edit-video.command';
