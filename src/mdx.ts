import fs from "fs";
import matter from "gray-matter";

import path from "path";
import readingTime, { ReadTimeResults } from "reading-time";

import { serialize } from "next-mdx-remote/serialize";

import { MDXRemoteSerializeResult } from "next-mdx-remote";

const root = process.cwd();

const docsFolder = "docs";

export function getCategories(): string[] {
  return fs.readdirSync(path.join(root, docsFolder));
}

export function getFiles(type: string): string[] {
  return fs.readdirSync(path.join(root, docsFolder, type));
}

export interface FileBySlug {
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
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
  const isMdx = fs.existsSync(path.join(root, docsFolder, type, `${slug}.mdx`));
  const filename = isMdx ? `${slug}.mdx` : `${slug}.md`;
  const source = fs.readFileSync(
    path.join(root, docsFolder, type, filename),
    "utf8"
  );
  const { data, content } = matter(source);
  const mdxSource = await serialize(source);
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
