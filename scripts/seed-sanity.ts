/**
 * Copies the site's built-in content (products, photos, lookbook, news, branches, settings) into Sanity.
 *
 *   npm run seed                 first time, into an empty dataset
 *   npm run seed -- --replace    overwrite the seeded documents again (loses edits made to them in the Studio)
 *
 * Runs with your own Sanity login (`npx sanity login`), so no API token is needed.
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import { buildSeedDocuments, seedImageFiles } from "../lib/sanity/seed";

async function main() {
  const client = getCliClient({ apiVersion: "2025-01-01" });
  const { projectId, dataset } = client.config();
  console.log(`Seeding Sanity project ${projectId}, dataset "${dataset}"`);

  const replace = process.argv.includes("--replace");
  const existing = await client.fetch<number>(`count(*[_type in ["product", "post", "lookbookStory", "branch"]])`);
  if (existing > 0 && !replace) {
    console.error(`Stopped: this dataset already has ${existing} products/posts/stories/branches.`);
    console.error(`Re-run with "npm run seed -- --replace" only if you want to overwrite the seeded ones (Studio edits to them are lost).`);
    process.exit(1);
  }

  // Upload each photo once; Sanity de-duplicates identical files, so re-running doesn't create copies.
  const files = seedImageFiles();
  const assetIds = new Map<string, string>();
  for (const [i, f] of files.entries()) {
    const path = join(process.cwd(), "public", f.url);
    const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(f.url) });
    assetIds.set(f.url, asset._id);
    console.log(`  photo ${i + 1}/${files.length}  ${basename(f.url)}`);
  }

  const docs = buildSeedDocuments((url) => {
    const id = assetIds.get(url);
    if (!id) throw new Error(`No uploaded asset for ${url}`);
    return id;
  });
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();

  const count = (t: string) => docs.filter((d) => d._type === t).length;
  console.log(
    `Done: ${count("product")} products, ${count("category")} categories, ${count("lookbookStory")} lookbook stories, ` +
      `${count("post")} news posts, ${count("branch")} branch, site settings, ${files.length} photos.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
