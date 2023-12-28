import {
    Box,
    Button,
    Container,
    FileInput,
    Group,
    MultiSelect,
    Radio,
    Select,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import eventCountries from "/public/eventCountries.js";
import eventTags from "/public/eventTags.js";
import useMyContext from "@/context/my-context";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    IconClock,
    IconLocation,
    IconPhoto,
    IconPlus,
    IconRefresh,
    IconTrash,
} from "@tabler/icons-react";

export default function Create() {
    const { supabase, session, allEvents, setAllEvents } = useMyContext();
    const router = useRouter();
    const [eventId, setEventId] = useState(router.query.e);
    const [isUpdating, setIsUpdating] = useState(false);

    const form = useForm({
        initialValues: {
            eventName: "",
            eventDescription: "",
            eventImage: "",
            eventStart: "",
            eventFinish: "",
            eventLocation: "",
            eventCountry: "",
            eventTags: [],
            eventIsPublic: "Public",
        },

        validate: {
            eventName: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
            eventStart: (value) => (value ? null : "Select a start date and time"),
            eventFinish: (value) => (value ? null : "Select a end date and time"),
            eventLocation: (value) => (value ? null : "Type a location for your event"),
            eventFinish: (value, values) =>
                value > values.eventStart ? null : "Your event can not end before it starts",
        },
    });

    useEffect(() => {
        form.setFieldValue("user_id", session?.user.id);
        setEventId(router.query.e);
    }, [router.query.e]);

    useEffect(() => {
        if (eventId) {
            setIsUpdating(true);
            const event = allEvents.find((event) => event.eventId === Number(eventId));
            if (!event) return;
            form.setFieldValue("eventName", event.eventName);
            form.setFieldValue("eventDescription", event.eventDescription);
            form.setFieldValue("eventImage", event.eventImage);
            form.setFieldValue("eventStart", new Date(Date.parse(event.eventStart)));
            form.setFieldValue("eventFinish", new Date(Date.parse(event.eventFinish)));
            form.setFieldValue("eventLocation", event.eventLocation);
            form.setFieldValue("eventCountry", event.eventCountry);
            form.setFieldValue("eventTags", event.eventTags);
            form.setFieldValue("eventIsPublic", event.eventIsPublic);
        }
    }, [allEvents]);

    const createEvent = async () => {
        try {
            const { data, error } = await supabase.from("events").insert(form.values).select();
            if (error) {
                throw error;
            } else {
                setAllEvents((prev) => [data[0], ...prev]);
                form.reset();
                router.push("/");
                notifications.show({
                    title: data[0].eventName + " created",
                    message: "Prepare to have a good time",
                });
            }
        } catch (error) {
            notifications.show({
                color: "red",
                title: "Creation Error",
                message: "Event could not be created",
            });
        }
    };

    const eventImageToBase64 = async (event) => {
        const toBase64 = (file) => {
            if (!file) return "";
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;
                    resolve(base64String);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        };
        const base64eventImage = await toBase64(event);
        if (base64eventImage.startsWith("data:image/")) {
            form.setFieldValue("eventImage", base64eventImage);
        }
    };

    const updateEvent = async () => {
        try {
            const { data, error } = await supabase
                .from("events")
                .update(form.values)
                .eq("eventId", eventId)
                .select();
            if (error) {
                throw error;
            } else {
                //test if supabase has return the new event, or if it denied the request
                if (Array.isArray(data) && data.length === 0) {
                    throw error;
                }
                setAllEvents((prev) => {
                    const updatedEvents = prev.filter((event) => event.eventId !== Number(eventId));
                    return [data[0], ...updatedEvents];
                });
                form.reset();
                router.push("/");
                notifications.show({
                    title: data[0].eventName + " updated",
                    message: "Prepare to have a good time again",
                });
            }
        } catch (error) {
            notifications.show({
                color: "red",
                title: "Error while opdating",
                message: "Event could not be updated",
            });
        }
    };

    const deleteEvent = async () => {
        try {
            const { error } = await supabase.from("events").delete().eq("eventId", eventId);
            if (error) {
                throw error;
            } else {
                setAllEvents((prev) => {
                    console.log(prev);
                    const updatedEvents = prev.filter((event) => event.eventId !== Number(eventId));
                    console.log(updatedEvents);
                    return updatedEvents;
                });
                form.reset();
                router.push("/");
                notifications.show({
                    title: form.values.eventName + " deleted",
                    message: "Dont think about that anymore",
                });
            }
        } catch (error) {
            notifications.show({
                color: "red",
                title: "Error while deleting",
                message: "Event could not be deleted",
            });
        }
    };

    return (
        <main>
            <Container>
                <Box maw={450} mx="auto">
                    <Title order={1} mb="sm">
                        {isUpdating ? "Update event" : "Create a new event"}
                    </Title>
                    <form
                        onSubmit={
                            isUpdating ? form.onSubmit(updateEvent) : form.onSubmit(createEvent)
                        }>
                        <Radio.Group {...form.getInputProps("eventIsPublic", { type: "radio" })}>
                            <Radio
                                label="Public event"
                                description="Can be accessed by anyone"
                                value="Public"
                                mb="sm"
                            />
                            <Radio
                                label="Private event"
                                description="Can only be accessed by you"
                                value="Private"
                                mb="sm"
                            />
                        </Radio.Group>

                        <TextInput
                            label="Name"
                            mb="sm"
                            description="Give your event a distinct name"
                            {...form.getInputProps("eventName")}
                        />

                        <Textarea
                            label="Description"
                            description="Explain what your event is all about"
                            autosize
                            minRows={3}
                            mb="sm"
                            {...form.getInputProps("eventDescription")}
                        />

                        <FileInput
                            label="Image"
                            description="Upload a cover image to the event"
                            placeholder={isUpdating ? "Update image?" : "Select image file"}
                            accept="image/png,image/jpeg,image/webp"
                            mb="sm"
                            onChange={eventImageToBase64}
                            rightSection={<IconPhoto size={16} />}
                        />

                        <DateTimePicker
                            label="Start"
                            placeholder="Choose date and time"
                            description="When should people arrive"
                            mb="sm"
                            rightSection={<IconClock size={16} />}
                            {...form.getInputProps("eventStart")}
                        />

                        <DateTimePicker
                            label="End"
                            placeholder="Choose date and time"
                            description="When should people leave"
                            mb="sm"
                            rightSection={<IconClock size={16} />}
                            minDate={form.values.eventStart}
                            {...form.getInputProps("eventFinish")}
                        />

                        <TextInput
                            label="Location"
                            mb="sm"
                            description="What adresse should people meet at?"
                            rightSection={<IconLocation size={16} />}
                            {...form.getInputProps("eventLocation")}
                        />

                        <Select
                            label="Country"
                            data={eventCountries}
                            searchable
                            clearable
                            checkIconPosition="right"
                            limit={4}
                            nothingFoundMessage="No country found"
                            placeholder="Search countries"
                            mb="sm"
                            {...form.getInputProps("eventCountry")}
                        />

                        <MultiSelect
                            label="Tags"
                            description="Add up to 3 tags for your event"
                            data={eventTags}
                            clearable
                            searchable
                            placeholder="Search tags"
                            checkIconPosition="right"
                            maxValues={3}
                            nothingFoundMessage="No tag found"
                            mb="sm"
                            {...form.getInputProps("eventTags")}
                        />

                        <Group justify={isUpdating ? "space-between" : "flex-end"} mt="md">
                            {isUpdating && (
                                <Button
                                    type="button"
                                    variant="light"
                                    color="red"
                                    onClick={deleteEvent}
                                    rightSection={<IconTrash size={16} />}>
                                    Delete
                                </Button>
                            )}
                            <Button
                                type="submit"
                                rightSection={
                                    isUpdating ? <IconRefresh size={16} /> : <IconPlus size={16} />
                                }>
                                {isUpdating ? "Update event" : "Create new event"}
                            </Button>
                        </Group>
                    </form>
                </Box>
            </Container>
        </main>
    );
}
