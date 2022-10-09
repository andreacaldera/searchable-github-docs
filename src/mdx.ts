import fs from "fs";
import matter from "gray-matter";
// @ts-ignore
import mdxPrism from "mdx-prism";
import path from "path";
import readingTime, { ReadTimeResults } from "reading-time";

import renderToString from "next-mdx-remote/render-to-string";

import MDXComponents from "./components/mdx-components";
import { MdxRemote } from "next-mdx-remote/types";

const root = process.cwd();

const docsFolder = "docs";

export function getCategories(): string[] {
  return fs.readdirSync(path.join(root, docsFolder));
}

export function getFiles(type: string): string[] {
  return fs.readdirSync(path.join(root, docsFolder, type));
}

export interface FileBySlug {
  mdxSource: MdxRemote.Source;
  frontMatter: {
    wordCount: number;
    readingTime: ReadTimeResults;
    slug: string | null;
    title: string;
    by: string;
    publishedAt: string;
  };
}

type FileData = {
  title: string;
  summary: string;
  by: string;
  publishedAt: string;
};

export const getFileBySlug = async (
  type: string,
  slug?: string
): Promise<FileBySlug> => {
  const source = slug
    ? fs.readFileSync(path.join(root, docsFolder, type, `${slug}.mdx`), "utf8")
    : fs.readFileSync(path.join(root, docsFolder, `${type}.mdx`), "utf8");

  const { data, content } = matter(source);
  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-autolink-headings"),
        require("remark-slug"),
        require("remark-code-titles"),
      ],
      rehypePlugins: [mdxPrism],
    },
  });

  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      ...(data as FileData),
    },
  };
};

type SummaryData = { slug: string; content: string } & FileData;

export type FileFontMatter = ReadonlyArray<SummaryData>;

export const getAllFilesFrontMatter = (type: string) => {
  const files = fs.readdirSync(path.join(root, docsFolder, type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, docsFolder, type, postSlug),
      "utf8"
    );
    const { data, content } = matter(source);

    return [
      {
        ...(data as FileData),
        content,
        slug: postSlug.replace(".mdx", ""),
      },
      ...allPosts,
    ];
  }, [] as FileFontMatter);
};
