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

import { getAllFilesFrontMatter, getCategories } from "../src/mdx";
import BlogPost from "../src/components/blog-post";

import { SearchIcon } from "@chakra-ui/icons";
import { GetStaticPaths, GetStaticProps } from "next";

type Post = {
  publishedAt: string;
  title: string;
  summary: string;
};

const Blog: FC<{ docs: Post[]; category: string }> = ({ docs, category }) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredBlogPosts = docs
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter((frontMatter) => {
      const search = searchValue.toLowerCase();
      const { title, summary } = frontMatter;
      return (
        title.toLowerCase().includes(search) ||
        summary.toLocaleLowerCase().includes(search)
      );
    });

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
            {category} ({docs.length} pages)
          </Heading>
          <InputGroup mb={4} mr={4} w="100%">
            <Input
              aria-label="Search by title / summary"
              placeholder="Search by title  / summary"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputRightElement>
              <SearchIcon color="gray.300" />
            </InputRightElement>
          </InputGroup>
          {!filteredBlogPosts.length && "No documentation found :("}
          {filteredBlogPosts.map((frontMatter) => (
            <BlogPost
              category="decision-logs"
              key={frontMatter.title}
              {...frontMatter}
            />
          ))}
        </Flex>
      </Stack>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  const paths = categories.map((page) => ({
    params: { page },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const category = context.params?.page as string;
  const docs = await getAllFilesFrontMatter(category);

  return { props: { docs, category } };
};

export default Blog;
