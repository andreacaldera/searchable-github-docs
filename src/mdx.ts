import fs from "fs";
import matter from "gray-matter";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mdxPrism from "mdx-prism";
import path from "path";
import readingTime, { ReadTimeResults } from "reading-time";

import renderToString from "next-mdx-remote/render-to-string";

import MDXComponents from "./components/mdx-components";
import { MdxRemote } from "next-mdx-remote/types";

const root = process.cwd();

export function getFiles(type: string): string[] {
  return fs.readdirSync(path.join(root, "docs", type));
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

export const getFileBySlug = async (
  type: string,
  slug?: string
): Promise<FileBySlug> => {
  const source = slug
    ? fs.readFileSync(path.join(root, "docs", type, `${slug}.mdx`), "utf8")
    : fs.readFileSync(path.join(root, "docs", `${type}.mdx`), "utf8");

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
      ...(data as { title: string; by: string; publishedAt: string }),
    },
  };
};

// todo fix type
type FileFontMatter = Record<string, any>[];

export function getAllFilesFrontMatter(type: string): FileFontMatter {
  const files = fs.readdirSync(path.join(root, "docs", type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, "docs", type, postSlug),
      "utf8"
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: postSlug.replace(".mdx", ""),
      },
      ...allPosts,
    ];
  }, [] as FileFontMatter);
}
