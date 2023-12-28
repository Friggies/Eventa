import EventCard from "@/components/molecules/EventCard";
import useMyContext from "@/context/my-context";
import { Container, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Profile() {
    const { session, allEvents, allEventParticipants } = useMyContext();

    const [userEvents, setUserEvents] = useState([]);
    const getUserEvents = () => {
        //Get all the events the user participates in
        const userParticipations = allEventParticipants.filter((participation) => {
            return participation.user_id === session.user.id;
        });
        //Create an array with the eventId's
        const userParticipationsEvents = userParticipations.map(
            (participation) => participation.eventId
        );
        //Select only events that the user has created or participates in
        const allUserEvents = allEvents.filter(
            (event) =>
                event.user_id === session.user.id ||
                userParticipationsEvents.includes(event.eventId)
        );
        setUserEvents(allUserEvents);
    };

    useEffect(() => {
        getUserEvents();
    }, [allEvents]);

    return (
        <main>
            <Container>
                <Title order={1}>Hi {session?.user.user_metadata.displayName}</Title>
                <Title order={2} mb="sm">
                    Your events:
                </Title>
                <Stack>
                    {userEvents.map((event) => {
                        return <EventCard event={event} key={event.eventId} />;
                    })}
                </Stack>
            </Container>
        </main>
    );
}
