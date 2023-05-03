import { PartialType } from '@nestjs/swagger';

import { TopicDto } from './topic.dto';

export class UpdateTopicDto extends PartialType(TopicDto) {}
