import React from "react";
import { Button, Container, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { IconLogout, IconPlus, IconUser } from "@tabler/icons-react";
import useMyContext from "@/context/my-context";
import { notifications } from "@mantine/notifications";

export default function Header() {
    const { supabase, session } = useMyContext();

    const logoutUser = async () => {
        try {
            if (!session) {
                throw "No user logged in";
            }
            let { error } = await supabase.auth.signOut();
            if (error) {
                throw "Logout error";
            } else {
                notifications.show({
                    title: "Logged out",
                    message: "You have successfully logged out",
                });
            }
        } catch (error) {
            notifications.show({
                color: "red",
                title: error,
                message: "Logout could not occur",
            });
        }
    };

    return (
        <header>
            <Container>
                <Flex justify="space-between" align="center" py="lg">
                    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <Text size="xl" fw="900" tt="uppercase">
                            Eventa
                        </Text>
                    </Link>
                    <Flex gap="xs">
                        <Link href="/create">
                            <Button>
                                <IconPlus />
                            </Button>
                        </Link>
                        <Link href="/profile" passHref>
                            <Button>
                                <IconUser />
                            </Button>
                        </Link>
                        <Button variant="subtle" onClick={logoutUser}>
                            <IconLogout />
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </header>
    );
}
