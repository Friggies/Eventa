import { Anchor, Container, Stack, Text } from "@mantine/core";
import React from "react";

export default function Footer() {
    return (
        <Container py="lg">
            <Stack gap="xs">
                <Text c="dimmed">&copy; 2023 ︱ Eventa</Text>
            </Stack>
        </Container>
    );
}
