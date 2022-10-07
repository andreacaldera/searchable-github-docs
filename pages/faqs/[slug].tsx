import { FC } from "react";
import hydrate from "next-mdx-remote/hydrate";
import { getFiles, getFileBySlug, FileBySlug } from "../../src/mdx";
import { BlogLayout } from "../../src/layouts/blog";
import MDXComponents from "../../src/components/mdx-components";
import { GetStaticProps, GetStaticPaths } from "next";

export const Blog: FC<FileBySlug> = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {
    components: MDXComponents,
  });

  return <BlogLayout frontMatter={frontMatter}>{content}</BlogLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getFiles("faqs");

  return {
    paths: posts.map((p) => ({
      params: {
        slug: p.replace(/\.mdx/, ""),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getFileBySlug("faqs", params?.slug as string);

  return { props: post };
};

export default Blog;
