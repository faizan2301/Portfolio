export interface FcmOptions {
  mode: "notification" | "data" | "both";
  title: string;
  body: string;
  image: string;
  token: string;
  topic: string;
  sound: string;
  clickAction: string;
  androidChannelId: string;
  priority: "normal" | "high";
  dataPairs: { key: string; value: string }[];
}

export function buildFcmPayload(opts: FcmOptions): object {
  const message: Record<string, unknown> = {};

  if (opts.token.trim()) message.token = opts.token.trim();
  else if (opts.topic.trim()) message.topic = opts.topic.trim();

  if (opts.mode === "notification" || opts.mode === "both") {
    const notification: Record<string, string> = {};
    if (opts.title.trim()) notification.title = opts.title.trim();
    if (opts.body.trim()) notification.body = opts.body.trim();
    if (opts.image.trim()) notification.image = opts.image.trim();
    message.notification = notification;
  }

  const data: Record<string, string> = {};
  for (const pair of opts.dataPairs) {
    if (pair.key.trim()) data[pair.key.trim()] = pair.value;
  }
  if (opts.mode === "data" || opts.mode === "both") {
    if (opts.mode === "data" && opts.title.trim()) data.title = opts.title.trim();
    if (opts.mode === "data" && opts.body.trim()) data.body = opts.body.trim();
    message.data = data;
  } else if (Object.keys(data).length) {
    message.data = data;
  }

  const android: Record<string, unknown> = {
    priority: opts.priority,
  };
  const androidNotification: Record<string, string> = {};
  if (opts.sound.trim()) androidNotification.sound = opts.sound.trim();
  if (opts.clickAction.trim())
    androidNotification.click_action = opts.clickAction.trim();
  if (opts.androidChannelId.trim())
    androidNotification.channel_id = opts.androidChannelId.trim();
  if (Object.keys(androidNotification).length) {
    android.notification = androidNotification;
  }
  message.android = android;

  message.apns = {
    payload: {
      aps: {
        sound: opts.sound.trim() || "default",
        "content-available": 1,
      },
    },
  };

  return { message };
}
