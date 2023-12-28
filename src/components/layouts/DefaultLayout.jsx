import React from "react";
import Footer from "../molecules/Footer";
import Header from "../molecules/Header";
import useMyContext from "@/context/my-context";
import { Button, Center, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DefaultLayout({ children }) {
    const { session } = useMyContext();
    const router = useRouter();
    return (
        <>
            <Header />
            {session || router.asPath == "/login" ? (
                children
            ) : (
                <>
                    <Center>
                        <Stack>
                            <Text>No user logged in</Text>
                            <Link href="/login" passHref>
                                <Button>Go to log in</Button>
                            </Link>
                        </Stack>
                    </Center>
                </>
            )}
            <Footer />
        </>
    );
}
