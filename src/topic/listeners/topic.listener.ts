import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Topic } from '../entities';
import { TopicService } from '../services';

@Injectable()
export class TopicListener {
  constructor(private readonly topicService: TopicService) {}

  @OnEvent('skill.topicsIds')
  async handleTopicsById(ids: number[]): Promise<Topic[]> {
    const topics = await this.topicService.findByIds(ids);
    return topics;
  }
}
