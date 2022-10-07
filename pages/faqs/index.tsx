import React, { useState, FC } from "react";
import Head from "next/head";
import {
  Heading,
  Flex,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { getAllFilesFrontMatter } from "../../src/mdx";
import BlogPost from "../../src/components/blog-post";

import { SearchIcon } from "@chakra-ui/icons";
import { GetStaticProps } from "next";

type Post = {
  publishedAt: string;
  title: string;
};

const Blog: FC<{ posts: Post[] }> = ({ posts }) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredBlogPosts = posts
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter((frontMatter) =>
      frontMatter.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
      <Head>
        <title>Searchable Github documentation</title>
      </Head>
      <Stack
        as="main"
        spacing={8}
        justifyContent="center"
        alignItems="flex-start"
        m="0 auto auto auto"
        minWidth="70%"
      >
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth="100%"
          px={4}
        >
          <Heading letterSpacing="tight" mb={4} as="h1" size="2xl">
            FAQs ({posts.length} pages)
          </Heading>
          <InputGroup mb={4} mr={4} w="100%">
            <Input
              aria-label="Search by title"
              placeholder="Search by title"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputRightElement>
              <SearchIcon color="gray.300" />
            </InputRightElement>
          </InputGroup>
          {!filteredBlogPosts.length && "No posts found :("}
          {filteredBlogPosts.map((frontMatter) => (
            <BlogPost
              category="faqs"
              key={frontMatter.title}
              {...frontMatter}
            />
          ))}
        </Flex>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllFilesFrontMatter("faqs");

  return { props: { posts } };
};

export default Blog;
