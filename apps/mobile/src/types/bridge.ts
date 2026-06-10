export interface BridgeProfile {
  token: string;
  comfortLevel: number;
  interestTags: string[];
  isAdult: boolean;
}

export interface MatchResult {
  matchScore: number;
  sharedInterests: string[];
  distanceMeters: number;
  icebreaker: string;
}
