import fs from "fs";
import matter from "gray-matter";

import path from "path";
import readingTime, { ReadTimeResults } from "reading-time";

import renderToString from "next-mdx-remote/render-to-string";

import { MDXComponents } from "./components/mdx-components";
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
  slug: string
): Promise<FileBySlug> => {
  console.log("get file by slug");
  const isMdx = fs.existsSync(path.join(root, docsFolder, type, `${slug}.mdx`));
  const filename = isMdx ? `${slug}.mdx` : `${slug}.md`;
  const source = fs.readFileSync(
    path.join(root, docsFolder, type, filename),
    "utf8"
  );

  const { data, content } = matter(source);
  console.log(JSON.stringify(content, null, 2), JSON.stringify(data, null, 2));
  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-autolink-headings"),
        require("remark-slug"),
        require("remark-code-titles"),
      ],
      rehypePlugins: [require("mdx-prism")],
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

export type SummaryData = { slug: string; content: string } & FileData;

export type FileFontMatter = ReadonlyArray<SummaryData>;

export const getAllFilesFrontMatter = (type: string) => {
  const files = fs.readdirSync(path.join(root, docsFolder, type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, docsFolder, type, postSlug),
      "utf8"
    );
    const { data, content } = matter(source);
    const fileData = !Object.keys(data).length
      ? {
          title: content
            .substring(content.indexOf("#") + 1, content.indexOf("\n"))
            .trim(),
        }
      : data;

    return [
      {
        ...(fileData as FileData),
        content,
        slug: postSlug.replace(".mdx", "").replace(".md", ""),
      },
      ...allPosts,
    ];
  }, [] as FileFontMatter);
};
