import React, { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Button, Group, Anchor, Flex, em } from "@mantine/core";
import {
    IconCalendar,
    IconCheck,
    IconInfoCircle,
    IconLocation,
    IconSettings,
    IconUserCheck,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import useMyContext from "@/context/my-context";

export default function EventCard({ event }) {
    const { session, allEventParticipants, addUserParticipation, subtractUserParticipation } =
        useMyContext();
    const eventStartObj = new Date(event.eventStart);
    const eventEndObj = new Date(event.eventFinish);
    const eventStart = eventStartObj.getDate() + "/" + (eventStartObj.getMonth() + 1);
    const eventEnd = eventEndObj.getDate() + "/" + (eventEndObj.getMonth() + 1);
    const eventPeriod = eventStart === eventEnd ? eventStart : eventStart + " - " + eventEnd;

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    const eventParticipants = allEventParticipants.filter((participation) => {
        return participation.eventId === event.eventId;
    });

    const [isParticipating, setIsParticipating] = useState(false);
    const getIsParticipating = () => {
        const userIsParticipating = eventParticipants.find((participation) => {
            return participation.user_id === session.user.id;
        });
        if (userIsParticipating) {
            setIsParticipating(true);
        }
    };
    const toggleParticipants = async () => {
        if (!isParticipating) {
            addUserParticipation(event);
        } else {
            subtractUserParticipation(event);
        }
        setIsParticipating(!isParticipating);
    };
    useEffect(() => {
        getIsParticipating();
    }, []);

    const isUserEvent = event.user_id === session.user.id;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            {event.eventImage && (
                <Card.Section mb="md">
                    <Image src={event.eventImage} h="250" fit="cover" />
                </Card.Section>
            )}

            <Group justify="space-between" mb={isMobile ? "sm" : ""}>
                <Text fw={700} size="xl">
                    {event.eventName}
                </Text>
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

            <Flex c="dimmed" justify="start" direction={isMobile ? "column" : "row"}>
                <Flex align="center" justify="start" gap={7}>
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
                            (event.eventCountry && "+" + event.eventCountry.replace(" ", "+"))
                        }
                        target="_blank">
                        {event.eventLocation}
                        {event.eventCountry && ", " + event.eventCountry}
                    </Anchor>
                    <IconLocation size={14} stroke="1.5" />
                </Flex>
            </Flex>

            {event.eventDescription && (
                <Text my="sm">
                    {event.eventDescription.substring(0, 93)}
                    {event.eventDescription.length > 100 ? "..." : null}
                </Text>
            )}

            <Flex justify="space-between" direction={isMobile ? "column" : "row"}>
                <Group c="blue" gap={0}>
                    <Text size="lg">{eventParticipants.length}</Text>
                    <IconUserCheck size={16} strokeWidth={2} />
                </Group>
                <Flex justify="space-between" gap="sm" direction={isMobile ? "column" : "row"}>
                    {isUserEvent && (
                        <Link
                            href={{ pathname: "/create", query: { e: event.eventId } }}
                            style={{ textDecoration: "none" }}>
                            <Button
                                variant="subtle"
                                fullWidth={isMobile}
                                aria-label="Event settings">
                                {isMobile && "Settings"}
                                <IconSettings size={16} />
                            </Button>
                        </Link>
                    )}
                    <Link href={"/event/" + event.eventId} style={{ textDecoration: "none" }}>
                        <Button
                            fullWidth={isMobile}
                            variant="light"
                            rightSection={<IconInfoCircle size={16} />}>
                            Information
                        </Button>
                    </Link>
                    <Button
                        variant={isParticipating ? "filled" : "outline"}
                        onClick={toggleParticipants}
                        fullWidth={isMobile}
                        rightSection={<IconCheck size={16} />}>
                        {isParticipating ? "Participating" : "Participate"}
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}
