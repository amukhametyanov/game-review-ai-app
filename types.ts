
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ScriptResult {
  script: string;
  sources: GroundingChunk[];
}
