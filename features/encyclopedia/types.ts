export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: string;
  category_display: string;
  tags: string[];
  image?: string;
  summary: string;
}

export type ArticleMetadata = Omit<ArticleFrontmatter, 'tags'> & {
    tags: string; // Fuse.js works better with a string
};


export interface EncyclopediaArticle {
  meta: ArticleFrontmatter;
  body: string;
}
