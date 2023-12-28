import useMyContext from "@/context/my-context";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLogin, IconMail, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

export default function LoginForm({ setIsLogin }) {
    const { supabase } = useMyContext();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            userEmail: "",
            userPassword: "",
        },

        validate: {
            userEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            userPassword: (value) =>
                value.length < 6 ? "Password must contain at least 6 characters" : null,
        },
    });

    const loginUser = async () => {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: form.values.userEmail,
            password: form.values.userPassword,
        });
        if (error) {
            notifications.show({
                color: "red",
                title: "Login error",
                message: "Login credentials not found",
            });
        } else if (data) {
            notifications.show({
                title: "Welcome " + data.user.user_metadata.displayName,
                message: "You have successfully logged in",
            });
            router.push("/");
        }
    };
    return (
        <form onSubmit={form.onSubmit(loginUser)}>
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
                    onClick={() => setIsLogin(false)}
                    rightSection={<IconUserPlus size={16} />}>
                    Need an account?
                </Button>
                <Button type="submit" rightSection={<IconLogin size={16} />}>
                    Login
                </Button>
            </Group>
        </form>
    );
}
