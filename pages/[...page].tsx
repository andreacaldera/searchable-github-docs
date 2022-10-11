import { FC } from "react";
import { MDXRemote } from "next-mdx-remote";

import { getFiles, getFileBySlug, FileBySlug, getCategories } from "../src/mdx";
import { DocLayout } from "../src/layouts/doc-layout";
import { MDXComponents } from "../src/components/mdx-components";
import { GetStaticProps, GetStaticPaths } from "next";

export const Blog: FC<FileBySlug> = ({ mdxSource, frontMatter }) => {
  return (
    <DocLayout frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />;
    </DocLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  const posts = await Promise.all(
    categories.map(async (category) => {
      const files = await getFiles(category);
      return files.map((file) => [
        category,
        file.replace(/\.mdx/, "").replace(/\.md/, ""),
      ]);
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
