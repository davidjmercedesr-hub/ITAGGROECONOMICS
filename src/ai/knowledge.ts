import type {AIContextPack} from './context-pack';

export type KnowledgeChunk={
  id:string;
  text:string;
  source?:{title?:string;url?:string;publisher?:string;retrievedAt?:string};
};

export type KnowledgeProvider={
  retrieve(query:string,context?:AIContextPack):Promise<KnowledgeChunk[]>;
};

export const emptyKnowledgeProvider:KnowledgeProvider={
  async retrieve(){return [];}
};
