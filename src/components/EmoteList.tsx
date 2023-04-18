import { Button, Card, Input, Loading, Pagination, Radio, Text, styled, useTheme } from "@nextui-org/react";
import { EmoteStats } from "../model";
import EmoteItem, { Cell, Row } from "./EmoteItem";
import { useLayoutEffect, useMemo, useState } from "react";
import { useDebounce } from "../utils/hooks";
import { ImSortAmountAsc, ImSortAmountDesc } from "react-icons/im";
import { useChannelStats } from "../api";


const iconButtonCss = {
    height: "28px",
    width: "30px",
    minWidth: "20px",
    backgroundColor: "rgb(0 0 0 / 0)",
    color: "rgba(255, 255, 255, 0.5)",
    "&:hover": {
        color: "rgba(255, 255, 255, 0.9)",
    }
};

const Container = styled("div", {
    display: "flex",
    flexDirection: "column",
    gap: "$sm",
});

const FlexWrap = styled("div", {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "$md",
    rowGap: 0,
});

const SortButtonsBox = styled("div", {
    display: "flex",
    alignSelf: "stretch",
    alignItems: "center",
    gap: "$xs",
});

const sortModes = {
    totalDesc: (a: EmoteStats, b: EmoteStats) => b.total - a.total,
    totalAsc: (a: EmoteStats, b: EmoteStats) => a.total - b.total,
    msgDesc: (a: EmoteStats, b: EmoteStats) => b.messages - a.messages,
    msgAsc: (a: EmoteStats, b: EmoteStats) => a.messages - b.messages,
} as const;

type SortMode = keyof typeof sortModes;

interface Props {
    channel: string;
}

export default function EmoteList({ channel }: Props) {
    const theme = useTheme();
    const { channelStats, isError, isLoading } = useChannelStats(channel);
    const [sortMode, setSortMode] = useState<SortMode>("totalDesc");
    const [emoteNameFilter, setEmoteNameFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [emotesPerPageValue, setEmotesPerPageValue] = useState<string>("15");
    const debouncedEmoteNameFilter = useDebounce(emoteNameFilter, 200);

    useLayoutEffect(function resetPageOnChannelChange() {
        setCurrentPage(0);
    }, [channel]);

    const filteredEmotes = useMemo(() => {
        if (!channelStats) return;

        const emotes = Object.values(channelStats.emotes);
        const sortedEmotes = sortMode ? emotes.sort(sortModes[sortMode]) : emotes;
        const filteredEmotes = sortedEmotes.filter(emote => emote.name.includes(debouncedEmoteNameFilter));

        return filteredEmotes;
    }, [sortMode, channelStats, debouncedEmoteNameFilter]);

    if (isLoading) return <Loading />;
    if (isError || !filteredEmotes) return <Text>Some error :(</Text>;

    const emotesPerPage = emotesPerPageValue === "all" ? Infinity : Number(emotesPerPageValue);
    const totalPages = Math.ceil(filteredEmotes.length / emotesPerPage);

    const paginatedEmotes = filteredEmotes.slice(currentPage * emotesPerPage, (currentPage + 1) * emotesPerPage);

    function handleEmotesPerPageChange(value: string) {
        setEmotesPerPageValue(value);
        setCurrentPage(0);
    }

    return (
        <Container>
            <Text size="$lg">{channel}</Text>
            <FlexWrap>
                <Input
                    value={emoteNameFilter}
                    aria-label="filter"
                    placeholder="Фильтр"
                    onChange={e => setEmoteNameFilter(e.target.value)}
                    clearable
                    css={{
                        flexGrow: 1,
                    }}
                />
                <Radio.Group
                    label="На странице"
                    defaultValue="15"
                    orientation="horizontal"
                    onChange={handleEmotesPerPageChange}
                    css={{
                        "> label": {
                            mb: 0,
                        }
                    }}
                >
                    <Radio size="sm" value="10">10</Radio>
                    <Radio size="sm" value="15">15</Radio>
                    <Radio size="sm" value="50">50</Radio>
                    <Radio size="sm" value="all">Все</Radio>
                </Radio.Group>
            </FlexWrap>
            <Card
                variant="bordered"
                css={{
                    width: "100%",
                }}
            >
                <Card.Header css={{
                    py: "$xs",
                }}>
                    <Row>
                        <Cell css={{ flex: "0 0 auto", width: "88px" }}>
                            <Text>Эмоут</Text>
                        </Cell>
                        <Cell>
                            <Text>Название</Text>
                        </Cell>
                        <Cell css={{ flex: "0.7 0.7 0" }}>
                            <Text css={{ flexGrow: 1 }}>Всего</Text>
                            <SortButtonsBox>
                                <Button
                                    icon={<ImSortAmountDesc color={sortMode === "totalDesc" ? theme.theme?.colors.primary.value : undefined} />}
                                    onPress={() => setSortMode("totalDesc")}
                                    css={iconButtonCss}
                                />
                                <Button
                                    icon={<ImSortAmountAsc color={sortMode === "totalAsc" ? theme.theme?.colors.primary.value : undefined} />}
                                    onPress={() => setSortMode("totalAsc")}
                                    css={{
                                        ...iconButtonCss,
                                        ml: "auto",
                                    }}
                                />
                            </SortButtonsBox>
                        </Cell>
                        <Cell css={{ flex: "0.7 0.7 0" }}>
                            <Text css={{ flexGrow: 1 }}>Сообщений</Text>
                            <SortButtonsBox>
                                <Button
                                    icon={<ImSortAmountDesc color={sortMode === "msgDesc" ? theme.theme?.colors.primary.value : undefined} />}
                                    onPress={() => setSortMode("msgDesc")}
                                    css={iconButtonCss}
                                />
                                <Button
                                    icon={<ImSortAmountAsc color={sortMode === "msgAsc" ? theme.theme?.colors.primary.value : undefined} />}
                                    onPress={() => setSortMode("msgAsc")}
                                    css={iconButtonCss}
                                />
                            </SortButtonsBox>
                        </Cell>
                    </Row>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{
                    py: "$sm",
                    "> :not(:last-of-type)": {
                        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                    }
                }}>
                    {paginatedEmotes.map(emote =>
                        <EmoteItem key={emote.id} emote={emote} />
                    )}
                </Card.Body>
                <Card.Divider />
                <Card.Footer css={{ justifyContent: "center" }}>
                    {totalPages > 1 &&
                        <Pagination
                            page={currentPage + 1}
                            total={totalPages}
                            onChange={page => setCurrentPage(page - 1)}
                        />
                    }
                </Card.Footer>
            </Card>
        </Container>
    );
}