import Twitter from "twitter";
import { Status } from "twitter-d";
import { Videos } from ".prisma/client";
import { get_time2 } from "../get_times";
export default async function (q: { video: Videos[] }) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY || "",
    consumer_secret: process.env.TWITTER_SECRET_API_KEY || "",
    access_token_key: process.env.TWITTER_ACCESS_TOKEN || "",
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  });
  if (!q?.video) {
    throw "not exist videoId";
  }
  /*
  const me = await client.get("account/verify_credentials", {});
  console.log("me", me);
  */
  // const videoId = "OroZzY9nRQk"; //t5nYpkLq0ZE
  const hashTag = "#にじさんじ #歌ってみた";
  let reply_id = "";
  let cnt = 1;
  console.log("----- video tweet -----");
  for await (const video of q.video) {
    const startTime = get_time2({
      time: video.startTime.toLocaleString(),
      format: "MM/DD HH:mm 公開",
      addZ: false,
      hour_ago: 9,
    });
    const msg = `
     [${startTime}]\n${video.title}\n${hashTag}\nhttps://youtu.be/${video.id}
   `;
    console.log("videoId=", video.id);
    console.log(msg);
    const res = <Status>(
      await client.post("statuses/update", {
        status: msg,
        in_reply_to_status_id: reply_id != "" ? reply_id : undefined,
        auto_populate_reply_metadata: true,
      })
    );
    reply_id = res.id_str
  }
  console.log("----- complete -----");
  1;
}

/*
TWITTER_API_KEY=3LNjT0HUlPz2dbBxI3sOrhG0q
TWITTER_SECRET_API_KEY=qPCyiuFB8guJV0Lh01ByhCGnWvZtMQtqfOM4JGsF8vvH4u09eV
TWITTER_ACCESS_TOKEN=1427211846419763211-8m664D6cJeMfKFzj7aaGh6N8OwzZrF
TWITTER_ACCESS_TOKEN_SECRET=u8ULHfT6Oq21PftHqLiKukfmdBSv7OYne3OmhMs600iz5
*/
