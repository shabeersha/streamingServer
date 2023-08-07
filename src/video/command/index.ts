import { CreateVideoHandler } from './create-video/create-video.handler';
import { DeleteVideoHandler } from './delete-video/delete-video.handler';
import { EditVideoHandler } from './edit-video/edit-video.handler';

export const VideoCommandHandlers = [
  CreateVideoHandler,
  EditVideoHandler,
  DeleteVideoHandler,
];

export * from './create-video/create-video.command';
export * from './edit-video/edit-video.command';
export * from './delete-video/delete-video.command';
