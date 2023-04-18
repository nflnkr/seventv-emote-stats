import { Image, Link, styled, Text } from "@nextui-org/react";
import { EmoteInfo, EmoteStats } from "../model";


export const Row = styled("div", {
    display: "flex",
    width: "100%",
    "> :not(:last-of-type)": {
        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
    }
});

export const Cell = styled("div", {
    flex: "1 1 0",
    overflow: "hidden",
    py: "$2",
    px: "$sm",
    alignSelf: "stretch",
    display: "flex",
    gap: "$xs",
    alignItems: "center",
    flexWrap: "wrap",
});

interface Props {
    emote: EmoteStats & EmoteInfo;
}

export default function EmoteItem({ emote }: Props) {
    if (emote.total < emote.messages) console.warn("Wrong emote stat for emote", emote);

    return (
        <Row>
            <Cell css={{ flex: "0 0 auto", width: "88px" }}>
                <Image
                    src={emote.url}
                    height={32}
                    showSkeleton={false}
                />
            </Cell>
            <Cell>
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://7tv.app/emotes/${emote.id}`}
                >{emote.name}</Link>
            </Cell>
            <Cell css={{ flex: "0.7 0.7 0" }}>
                <Text>{emote.total}</Text>
            </Cell>
            <Cell css={{ flex: "0.7 0.7 0" }}>
                <Text>{emote.messages}</Text>
            </Cell>
        </Row>
    );
}