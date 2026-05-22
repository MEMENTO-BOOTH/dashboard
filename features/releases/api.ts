import "server-only";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  type Channel,
  type GithubRelease,
  githubReleaseSchema,
  type ReleaseResponse,
} from "./schemas";

const GITHUB_API = "https://api.github.com";
const githubReleaseListSchema = z.array(githubReleaseSchema);

function authHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `token ${env.GITHUB_TOKEN}`;
  return headers;
}

async function fetchProdRelease(): Promise<GithubRelease | null> {
  const res = await fetch(`${GITHUB_API}/repos/${env.GITHUB_REPO}/releases/latest`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub /releases/latest: ${res.status}`);
  return githubReleaseSchema.parse(await res.json());
}

async function fetchDevRelease(): Promise<GithubRelease | null> {
  const res = await fetch(`${GITHUB_API}/repos/${env.GITHUB_REPO}/releases?per_page=10`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`GitHub /releases: ${res.status}`);
  const list = githubReleaseListSchema.parse(await res.json());
  return list[0] ?? null;
}

function pickExeAsset(release: GithubRelease) {
  return release.assets.find((a) => a.name.toLowerCase().endsWith(".exe")) ?? null;
}

export async function fetchLatestRelease(channel: Channel): Promise<ReleaseResponse | null> {
  const release = channel === "prod" ? await fetchProdRelease() : await fetchDevRelease();
  if (!release) return null;
  const asset = pickExeAsset(release);
  if (!asset) return null;
  return {
    channel,
    version: release.tag_name.replace(/^v/, ""),
    tag: release.tag_name,
    prerelease: release.prerelease,
    publishedAt: release.published_at ?? null,
    notes: release.body ?? "",
    asset: {
      name: asset.name,
      downloadUrl: asset.url,
      size: asset.size,
    },
  };
}
