import useMyContext from "@/context/my-context";
import {
    Anchor,
    Badge,
    Container,
    Flex,
    Group,
    Image,
    Stack,
    Text,
    Title,
    em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconLocation, IconLock, IconWorld } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function Events() {
    const { allEvents } = useMyContext();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    const event = allEvents.find((event) => event.eventId === Number(router.query.id));

    if (!event) {
        return (
            <main>
                <Container>
                    <Stack>
                        <Text c="dimmed" ta="center">
                            Please wait
                        </Text>
                        <Text size="lg" ta="center">
                            Loading event
                        </Text>
                    </Stack>
                </Container>
            </main>
        );
    }

    const eventStartObj = new Date(event.eventStart);
    const eventEndObj = new Date(event.eventFinish);
    const eventStart =
        eventStartObj.getDate() +
        "/" +
        (eventStartObj.getMonth() + 1) +
        "/" +
        String(eventStartObj.getFullYear()).slice(2);
    const eventEnd =
        eventEndObj.getDate() +
        "/" +
        (eventEndObj.getMonth() + 1) +
        "/" +
        String(eventEndObj.getFullYear()).slice(2);

    const eventPeriod = eventStart === eventEnd ? eventStart : eventStart + " - " + eventEnd;

    const eventIsPublic = event.eventIsPublic === "Public" ? true : false;

    return (
        <main>
            <Container>
                <Title order={1} mb="md">
                    {event.eventName}
                </Title>
                {event.eventImage && (
                    <Image src={event.eventImage} h="250" fit="cover" radius="md" mb="md" />
                )}
                <Group justify="space-between" mb="md">
                    <Flex c="dimmed" justify="start" direction={isMobile ? "column" : "row"}>
                        <Flex align="center" justify="start" gap={7}>
                            {eventIsPublic ? (
                                <IconWorld size={14} stroke="1.5" />
                            ) : (
                                <IconLock size={14} stroke="1.5" />
                            )}
                            {eventPeriod}
                            <IconCalendar size={14} stroke="1.5" />
                        </Flex>
                        {!isMobile && "︱"}
                        <Flex align="center" gap={7}>
                            <Anchor
                                c="dimmed"
                                td="underline"
                                href={
                                    "https://www.google.com/maps/search/?api=1&query=" +
                                    event.eventLocation.replace(" ", "+") +
                                    (event.eventCountry &&
                                        "+" + event.eventCountry.replace(" ", "+"))
                                }
                                target="_blank">
                                {event.eventLocation}
                                {event.eventCountry && ", " + event.eventCountry}
                            </Anchor>
                            <IconLocation size={14} stroke="1.5" />
                        </Flex>
                    </Flex>
                    <Group>
                        {event.eventTags.map((tag) => {
                            return (
                                <Badge variant="dot" key={tag}>
                                    {tag}
                                </Badge>
                            );
                        })}
                    </Group>
                </Group>
                <Text>{event.eventDescription}</Text>
            </Container>
        </main>
    );
}
