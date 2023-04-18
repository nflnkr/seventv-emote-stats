

export interface ChannelStats {
    channel: string;
    emotes: EmoteCountMap;
}

export interface EmoteCountMap {
    [emoteId: string]: EmoteStats & EmoteInfo;
}

export interface EmoteInfo {
    id: string;
    name: string;
    url: string;
}

export interface EmoteStats {
    total: number;
    messages: number;
}