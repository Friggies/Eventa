import useMyContext from "@/context/my-context";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLogin, IconMail, IconUser, IconUserPlus } from "@tabler/icons-react";
import React from "react";

export default function SignUpForm({ setIsLogin }) {
    const { supabase } = useMyContext();

    const form = useForm({
        initialValues: {
            userEmail: "",
            userPassword: "",
            displayName: "",
        },

        validate: {
            userEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            userPassword: (value) =>
                value.length < 6 ? "Password must contain at least 6 characters" : null,
            displayName: (value) =>
                value.length < 4 ? "Displayname must contain at least 4 characters" : null,
        },
    });

    const signUpUser = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: form.values.userEmail,
            password: form.values.userPassword,
            options: {
                data: {
                    displayName: form.values.displayName,
                },
            },
        });
        if (error) {
            notifications.show({
                color: "red",
                title: "Sign up error",
                message: "User could not be created",
            });
        } else if (data) {
            notifications.show({
                title: "Hi " + data.user.user_metadata.displayName,
                message: "Check your email for a confirmation email",
            });
        }
    };
    return (
        <form onSubmit={form.onSubmit(signUpUser)}>
            <TextInput
                label="Displayname"
                mb="sm"
                rightSection={<IconUser size={16} />}
                {...form.getInputProps("displayName")}
            />
            <TextInput
                label="Email"
                mb="sm"
                rightSection={<IconMail size={16} />}
                {...form.getInputProps("userEmail")}
            />
            <PasswordInput label="Password" mb="sm" {...form.getInputProps("userPassword")} />
            <Group justify="space-between" mt="md">
                <Button
                    variant="light"
                    onClick={() => setIsLogin(true)}
                    rightSection={<IconLogin size={16} />}>
                    Already have an account?
                </Button>
                <Button type="submit" rightSection={<IconUserPlus size={16} />}>
                    Signup
                </Button>
            </Group>
        </form>
    );
}
