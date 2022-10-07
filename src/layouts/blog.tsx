import React, { FC } from "react";
import Head from "next/head";
import { parseISO, format } from "date-fns";
import {
  useColorMode,
  Heading,
  Text,
  Flex,
  Stack,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { FileBySlug } from "../mdx";

export const BlogLayout: FC<{ frontMatter: FileBySlug["frontMatter"] }> = ({
  children,
  frontMatter,
}) => {
  const { colorMode } = useColorMode();
  const textColor = {
    light: "gray.700",
    dark: "gray.400",
  };
  const router = useRouter();
  const slug = router.asPath.replace("/blog", "");
  return (
    <>
      <Head>
        <title>{slug} - Searchable Github documentation</title>
      </Head>
      <Stack
        as="article"
        spacing={8}
        justifyContent="center"
        alignItems="flex-start"
        m="0 auto 4rem auto"
        width={["95%", "90%", "80%", "60%"]}
        px={2}
      >
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          w="100%"
        >
          <Heading letterSpacing="tight" mb={2} as="h1" size="2xl">
            {frontMatter.title}
          </Heading>
          <Flex
            justify="space-between"
            align={["initial", "center"]}
            direction={["column", "row"]}
            mt={2}
            w="100%"
            mb={4}
          >
            <Flex align="center">
              <Avatar
                size="xs"
                name="Andrea Caldera"
                //
                // fix image src="../images/portrait.jpeg"
                mr={2}
              />
              <Text fontSize="sm" color={textColor[colorMode]}>
                {frontMatter.by}
                {"Andrea Caldera / "}
                {format(parseISO(frontMatter.publishedAt), "MMMM dd, yyyy")}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500" minWidth="100px" mt={[2, 0]}>
              {frontMatter.readingTime.text}
            </Text>
          </Flex>
        </Flex>
        {children}
      </Stack>
    </>
  );
};
