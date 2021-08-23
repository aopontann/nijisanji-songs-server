import { google, youtube_v3 } from "googleapis";
import fs from "fs";

export default async function (q: {
  videoId?: string[];
  id?: string[];
  playlistId: string;
}): Promise<void> {
  const delete_videoId = q.videoId || [];
  const delete_id = q.id || [];
  const playlistId = q.playlistId;
  const CREDENTIALS_PATH = "./client_secret.json";
  const TOKEN_PATH = "./token.json";
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oAuth2Client.setCredentials(token);
  const service = google.youtube("v3");

  const all_deleteId: string[] = [...delete_id];

  if (delete_videoId) {
    const result_playlistItems = await service.playlistItems
      .list({
        part: ["id", "snippet"],
        playlistId,
        auth: oAuth2Client,
      })
      .catch((e) => {
        throw e;
      });
    // 消す動画のidを取得(videoIdではない)
    result_playlistItems.data?.items?.forEach((item) => {
      const videoId = item.snippet?.resourceId?.videoId || "";
      delete_videoId.includes(videoId)
        ? all_deleteId.push(item.id as string)
        : "";
    });
  }

  console.log("----- playlistItems delete -----");
  for await (const id of all_deleteId) {
    await service.playlistItems
      .delete({
        id,
        auth: oAuth2Client,
      })
      .catch((e) => {
        console.error("error:", e);
        throw e;
      });
    console.log("id", id);
  }
  console.log("----- complete -----");
}