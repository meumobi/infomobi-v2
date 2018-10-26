import { Profile } from '@profiles/models';

export class Comment {
  id: string;
  channel: string;
  type: string;
  created: number;
  published: number;
  modified: number;
  isPublished: boolean;

  constructor(type: string) {
    this.type = type;
    this.channel = 'live';
    this.created = Date.now();
    this.published = Date.now();
    this.modified = Date.now();
    this.isPublished = true;
  }
}

export class Anniversaries extends Comment {
  picture: string;
  title: string;
  media: Array<{url: string}>;
  contacts: Array<Profile>;
  constructor() {
    super('anniversaries');
    this.media = [];
  }
}

export class Message extends Comment {
  author: Profile;
  description: string;
  itemDetails: {
    title: string,
    id: string
  };
  media: Array<{url: string}>;
  constructor() {
    super('message');
    this.media = [];
  }
}
