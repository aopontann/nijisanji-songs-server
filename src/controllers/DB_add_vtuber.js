const admin = require("firebase-admin");

// タイムゾーンの時間を取得
const { formatToTimeZone } = require("date-fns-timezone");

// 初期化は一度だけ
if(!admin.apps.length){
  console.log("admin 初期化するよ");
  const serviceAccount = require("../../path/to/natural-venture-305013-21e2c77b1f88.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log("admin 初期化してあるよ");
}

const db = admin.firestore();

module.exports = async function (data) {
  try {
    const res = await db.collection("VtuberInfo-nijisanji").doc(data.name).set(data);
    return "Success!"
  } catch (error) {
    console.log("DB_add_vtuber_error", error);
    return "error";
  }
};
