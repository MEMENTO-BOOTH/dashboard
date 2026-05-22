import { z } from "zod";

export const channelSchema = z.enum(["prod", "dev"]);
export type Channel = z.infer<typeof channelSchema>;

const githubAssetSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  size: z.number().int(),
});

export const githubReleaseSchema = z.object({
  tag_name: z.string(),
  name: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  prerelease: z.boolean(),
  published_at: z.string().nullable().optional(),
  assets: z.array(githubAssetSchema),
});
export type GithubRelease = z.infer<typeof githubReleaseSchema>;

export const releaseResponseSchema = z.object({
  channel: channelSchema,
  version: z.string(),
  tag: z.string(),
  prerelease: z.boolean(),
  publishedAt: z.string().nullable(),
  notes: z.string(),
  asset: z.object({
    name: z.string(),
    downloadUrl: z.string().url(),
    size: z.number().int(),
  }),
});
export type ReleaseResponse = z.infer<typeof releaseResponseSchema>;
