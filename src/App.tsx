import { Button, Divider, Loading, Text, styled } from "@nextui-org/react";
import { useState } from "react";
import EmoteList from "./components/EmoteList";
import { useChannellist } from "./api";


const Container = styled("div", {
    maxWidth: "900px",
    px: "$md",
    py: "$lg",
    mx: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "$md",
    "@xsMax": {
        px: "$xs",
    }
});

const Flex = styled("div", {
    display: "flex",
    gap: "$xs",
});

export default function App() {
    const { channellist, isError, isLoading } = useChannellist();
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    if (isError) return (
        <Container>
            <Text css={{ textAlign: "center" }}>Some error :(</Text>
        </Container>
    );

    if (isLoading) return (
        <Container>
            <Loading />
        </Container>
    );

    return (
        <Container>
            <Flex>
                {channellist && channellist.map(channel =>
                    <Button
                        key={channel}
                        size="sm"
                        auto
                        flat
                        color={channel === selectedChannel ? "success" : "default"}
                        onPress={() => setSelectedChannel(channel)}
                    >{channel}</Button>
                )}
            </Flex>
            <Divider />
            {selectedChannel && <EmoteList channel={selectedChannel} />}
        </Container>
    );
}
