import prisma from "./client";
import add_video from "../src/controllers/video/add_video";

const all_vtuberInfo = require("../jsonFolder/vtuber.json");
const videoInfo = require("../jsonFolder/sample_videoInfo.json");

async function main() {
  // vtuber init
  for await (const vtuberInfo of all_vtuberInfo.list) {
    let errorFlag = false
    console.log("name", vtuberInfo.name);
    await prisma.vtuber
      .upsert({
        where: { id: vtuberInfo.id },
        create: {
          id: vtuberInfo.id,
          name: vtuberInfo.name,
          readname: vtuberInfo.readname,
          affiliation: vtuberInfo.affiliation,
          birthday: vtuberInfo.birthday,
        },
        update: {}
      })
      .catch((e) => {
        errorFlag = true;
      })
      .finally(() => {
        errorFlag ? console.log("error!") : console.log("success!")
      });
  }

  // video test data
  
  const result_add = await add_video({
    all_videoInfo: [videoInfo],
    songConfirm: true
  });
  console.log(result_add);
  /*
  const thumb = videoInfo.snippet.thumbnails;
  const statistics = videoInfo.statistics;
  await prisma.videos.upsert({
    where: { id: videoInfo.id },
    create: {
      id: videoInfo.id,
      title: videoInfo.snippet.title,
      description: videoInfo.snippet.description,
      songConfirm: true,
      startTime: videoInfo.liveStreamingDetails
        ? toJST(videoInfo.liveStreamingDetails.scheduledStartTime)
        : toJST(videoInfo.snippet.publishedAt),
      createdAt: get_time("Asia/Tokyo", 0),
      thumbnail: {
        create: {
          defaultUrl: thumb.default ? thumb.default.url : null,
          medium: thumb.medium ? thumb.medium.url : null,
          high: thumb.high ? thumb.high.url : null,
          standard: thumb.standard ? thumb.standard.url : null,
          maxres: thumb.maxres ? thumb.maxres.url : null,
        },
      },
      dayCount: {
        create: {
          viewCount: statistics.viewCount ? Number(statistics.viewCount) : null,
          likeCount: statistics.likeCount ? Number(statistics.likeCount) : null,
          dislikeCount: statistics.dislikeCount ? Number(statistics.dislikeCount) : null,
          commentCount: statistics.commentCount ? Number(statistics.commentCount) : null,
          createdAt: get_time("Asia/Tokyo", 0),
        },
      },
      songVtuber: {
        create: {
          role: "歌",
          channelId: "UCSFCh5NL4qXrAy9u-u2lX3g",
          createdAt: get_time("Asia/Tokyo", 0),
        },
      },
    },
    update: {},
  }).catch((e) => {
    console.log("seed addVideo error!");
  }).finally(() => {
    console.log("finished");
  })
  */
  
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });