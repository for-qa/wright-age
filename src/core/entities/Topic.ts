// src/core/entities/Topic.ts
export interface TopicTag {
  label: string;
  color: string;
  bg: string;
}

export interface Topic {
  readonly file: string;
  readonly title: string;
  readonly number: string;
  readonly category?: string;
  readonly desc?: string;
  readonly tags?: TopicTag[];
}
