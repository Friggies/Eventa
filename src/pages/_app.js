import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { MyContext } from "@/context/my-context";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { createClient } from "@supabase/supabase-js";
import { Notifications, notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

const supabase = createClient(
    "https://ofigirexsutleoxcwgzt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maWdpcmV4c3V0bGVveGN3Z3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4MTE1MzYsImV4cCI6MjAxODM4NzUzNn0.DY6P01PrPVCBId6yOH8TfLaI5MC4x-PCMKorMpw-Kb0"
);

export default function App({ Component, pageProps }) {
    //fetch session
    const [session, setSession] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    //fetch all events
    const [allEvents, setAllEvents] = useState([]);
    const fetchAllEvents = async () => {
        try {
            let { data: events, error } = await supabase
                .from("events")
                .select("*")
                .order("eventStart", { ascending: true });
            if (error) {
                throw error;
            }
            setAllEvents(events);
        } catch (error) {
            console.log(error);
            notifications.show({
                color: "red",
                title: "Can not fetch events",
                message: "Events could not be fetched from Eventa",
            });
        }
    };

    //fetch all participants
    const [allEventParticipants, setAllEventParticipants] = useState([]);
    const fetchAllEventParticipants = async () => {
        try {
            let { data: participations, error } = await supabase.from("participations").select("*");
            if (error) {
                throw error;
            }
            setAllEventParticipants(participations);
        } catch (error) {
            console.log(error);
            notifications.show({
                color: "red",
                title: "Can not fetch participants",
                message: "Events could not be fetched from Eventa",
            });
        }
    };
    const addUserParticipation = async (event) => {
        const { data, error } = await supabase
            .from("participations")
            .insert([{ eventId: event.eventId }])
            .select();
        if (error) {
            console.log(error);
        } else if (data) {
            //Success; add the new object to the state
            setAllEventParticipants((prev) => [...prev, data[0]]);
        }
    };
    const subtractUserParticipation = async (event) => {
        const { error } = await supabase
            .from("participations")
            .delete()
            .eq("eventId", event.eventId);
        if (error) {
            console.log(error);
        } else {
            //Success; remove the old element from the state
            setAllEventParticipants((prev) =>
                prev.filter(
                    (participation) =>
                        !(
                            participation.eventId === event.eventId &&
                            participation.user_id === session.user.id
                        )
                )
            );
        }
    };

    //Fetch everything on load
    useEffect(() => {
        fetchAllEvents();
        fetchAllEventParticipants();
    }, [session]);

    const contextValue = {
        supabase,
        session,
        allEvents,
        setAllEvents,
        allEventParticipants,
        setAllEventParticipants,
        addUserParticipation,
        subtractUserParticipation,
    };

    return (
        <MyContext.Provider value={contextValue}>
            <MantineProvider defaultColorScheme="dark">
                <Notifications limit={3} />
                <DefaultLayout>
                    <Component {...pageProps} />
                </DefaultLayout>
            </MantineProvider>
        </MyContext.Provider>
    );
}
