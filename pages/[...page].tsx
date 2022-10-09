import { FC } from "react";
import hydrate from "next-mdx-remote/hydrate";
import { getFiles, getFileBySlug, FileBySlug, getCategories } from "../src/mdx";
import { BlogLayout } from "../src/layouts/blog";
import MDXComponents from "../src/components/mdx-components";
import { GetStaticProps, GetStaticPaths } from "next";

export const Blog: FC<FileBySlug> = ({ mdxSource, frontMatter }) => {
  const content = hydrate(mdxSource, {
    components: MDXComponents,
  });

  return <BlogLayout frontMatter={frontMatter}>{content}</BlogLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();
  console.log({ categories });
  const posts = await Promise.all(
    categories.map(async (category) => {
      const files = await getFiles(category);
      return files.map((file) => [category, file.replace(/\.mdx/, "")]);
    })
  );

  const paths = posts.flat().map((page) => ({
    params: { page },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const paths = params?.page as [string, string];
  const post = await getFileBySlug(paths[0], paths[1]);

  return { props: post };
};

export default Blog;
