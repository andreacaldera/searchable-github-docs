import React, { FC } from "react";

import { parseISO, format } from "date-fns";
import {
  useColorMode,
  Heading,
  Text,
  Flex,
  Stack,
  Avatar,
} from "@chakra-ui/react";

import { FileBySlug } from "../mdx";
import styled from "styled-components";

const ContentWrapper = styled.div`
  width: 100%;
  h2 {
    border-bottom: 2px solid lightgrey;
    width: 100%;
    font-size: 2rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }
  h3 {
    border-bottom: 0.5px solid lightgrey;
    width: 80%;
    margin-top: 1.5rem;
    margin-bottom: 1em;
  }
`;

export const DocLayout: FC<{ frontMatter: FileBySlug["frontMatter"] }> = ({
  children,
  frontMatter,
}) => {
  const { colorMode } = useColorMode();
  const textColor = {
    light: "gray.700",
    dark: "gray.400",
  };

  return (
    <>
      <Stack
        as="article"
        spacing={8}
        justifyContent="center"
        alignItems="flex-start"
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
              <Avatar size="xs" name="Andrea Caldera" mr={2} />
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
        <ContentWrapper>{children}</ContentWrapper>
      </Stack>
    </>
  );
};
