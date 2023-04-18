import useSWR from "swr";
import { ChannelStats } from "./model";
import { useLayoutEffect, useRef } from "react";


// const apiUrl = "http://localhost:3312";
const apiUrl = "http://194.87.110.212";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useChannellist() {
    const dataRef = useRef<string[] | undefined>(undefined);
    const { data, error, isLoading } = useSWR<string[]>(`${apiUrl}/channellist`, fetcher);

    if (data) dataRef.current = data;

    return {
        channellist: dataRef.current,
        isLoading,
        isError: dataRef.current ? false : error,
    };
}

export function useChannelStats(channel: string) {
    const dataRef = useRef<ChannelStats | undefined>(undefined);
    const { data, error, isLoading } = useSWR<ChannelStats>(`${apiUrl}/${channel}`, fetcher, { refreshInterval: 1000 });

    if (data && Object.keys(data.emotes).length > 0) dataRef.current = data;

    useLayoutEffect(function resetData() {
        dataRef.current = undefined;
    }, [channel]);

    return {
        channelStats: dataRef.current,
        isLoading,
        isError: dataRef.current ? false : error,
    };
}
