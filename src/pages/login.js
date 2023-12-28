import React, { useState } from "react";
import { Box, Button, Container, Text, Title } from "@mantine/core";
import useMyContext from "@/context/my-context";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import LoginForm from "@/components/molecules/LoginForm";
import SignUpForm from "@/components/molecules/SignUpForm";

export default function Login() {
    const { session } = useMyContext();
    const [isLogin, setIsLogin] = useState(true);

    return (
        <main>
            <Container>
                <Box maw={450} mx="auto">
                    <Title order={1} mb="sm">
                        {isLogin ? "Log in" : "Sign up"}
                    </Title>
                    {session && (
                        <>
                            <Link href="/">
                                <Button mb="lg" rightSection={<IconArrowRight size={16} />}>
                                    Welcome back {session.user.user_metadata.displayName}
                                </Button>
                            </Link>
                            <Text c="dimmed" mb="sm">
                                Not {session.user.user_metadata.displayName}?{" "}
                                {isLogin ? "Log in" : "Sign up"} here:
                            </Text>
                        </>
                    )}
                    {isLogin ? (
                        <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />
                    ) : (
                        <SignUpForm isLogin={isLogin} setIsLogin={setIsLogin} />
                    )}
                </Box>
            </Container>
        </main>
    );
}
