export type PermissionLevel = "normal" | "dangerous" | "signature" | "special";

export interface AndroidPermission {
  name: string;
  level: PermissionLevel;
  group?: string;
  description: string;
}

export const ANDROID_PERMISSIONS: AndroidPermission[] = [
  { name: "android.permission.INTERNET", level: "normal", description: "Open network sockets." },
  { name: "android.permission.ACCESS_NETWORK_STATE", level: "normal", description: "Access info about networks." },
  { name: "android.permission.ACCESS_WIFI_STATE", level: "normal", description: "Access info about Wi-Fi networks." },
  { name: "android.permission.CHANGE_WIFI_STATE", level: "normal", description: "Change Wi-Fi connectivity state." },
  { name: "android.permission.VIBRATE", level: "normal", description: "Access the vibrator." },
  { name: "android.permission.WAKE_LOCK", level: "normal", description: "Keep processor from sleeping / screen bright." },
  { name: "android.permission.RECEIVE_BOOT_COMPLETED", level: "normal", description: "Receive boot completed broadcast." },
  { name: "android.permission.FOREGROUND_SERVICE", level: "normal", description: "Use foreground services." },
  { name: "android.permission.POST_NOTIFICATIONS", level: "dangerous", group: "notifications", description: "Post notifications (Android 13+)." },
  { name: "android.permission.CAMERA", level: "dangerous", group: "camera", description: "Access the camera device." },
  { name: "android.permission.RECORD_AUDIO", level: "dangerous", group: "microphone", description: "Record audio." },
  { name: "android.permission.READ_CONTACTS", level: "dangerous", group: "contacts", description: "Read the user's contacts data." },
  { name: "android.permission.WRITE_CONTACTS", level: "dangerous", group: "contacts", description: "Write the user's contacts data." },
  { name: "android.permission.GET_ACCOUNTS", level: "dangerous", group: "contacts", description: "Access the list of accounts." },
  { name: "android.permission.ACCESS_FINE_LOCATION", level: "dangerous", group: "location", description: "Access precise location." },
  { name: "android.permission.ACCESS_COARSE_LOCATION", level: "dangerous", group: "location", description: "Access approximate location." },
  { name: "android.permission.ACCESS_BACKGROUND_LOCATION", level: "dangerous", group: "location", description: "Access location in the background." },
  { name: "android.permission.READ_EXTERNAL_STORAGE", level: "dangerous", group: "storage", description: "Read external storage (legacy)." },
  { name: "android.permission.WRITE_EXTERNAL_STORAGE", level: "dangerous", group: "storage", description: "Write external storage (legacy)." },
  { name: "android.permission.READ_MEDIA_IMAGES", level: "dangerous", group: "storage", description: "Read image files from shared storage." },
  { name: "android.permission.READ_MEDIA_VIDEO", level: "dangerous", group: "storage", description: "Read video files from shared storage." },
  { name: "android.permission.READ_MEDIA_AUDIO", level: "dangerous", group: "storage", description: "Read audio files from shared storage." },
  { name: "android.permission.READ_PHONE_STATE", level: "dangerous", group: "phone", description: "Read phone state and identity." },
  { name: "android.permission.CALL_PHONE", level: "dangerous", group: "phone", description: "Initiate a phone call without UI." },
  { name: "android.permission.READ_CALL_LOG", level: "dangerous", group: "call_log", description: "Read the user's call log." },
  { name: "android.permission.WRITE_CALL_LOG", level: "dangerous", group: "call_log", description: "Write the user's call log." },
  { name: "android.permission.SEND_SMS", level: "dangerous", group: "sms", description: "Send SMS messages." },
  { name: "android.permission.RECEIVE_SMS", level: "dangerous", group: "sms", description: "Receive SMS messages." },
  { name: "android.permission.READ_SMS", level: "dangerous", group: "sms", description: "Read SMS messages." },
  { name: "android.permission.BODY_SENSORS", level: "dangerous", group: "sensors", description: "Access body sensors (heart rate, etc.)." },
  { name: "android.permission.ACTIVITY_RECOGNITION", level: "dangerous", group: "activity", description: "Recognize physical activity." },
  { name: "android.permission.BLUETOOTH", level: "normal", description: "Connect to paired Bluetooth devices." },
  { name: "android.permission.BLUETOOTH_ADMIN", level: "normal", description: "Discover and pair Bluetooth devices." },
  { name: "android.permission.BLUETOOTH_CONNECT", level: "dangerous", group: "nearby", description: "Connect to paired Bluetooth devices (12+)." },
  { name: "android.permission.BLUETOOTH_SCAN", level: "dangerous", group: "nearby", description: "Scan for Bluetooth devices (12+)." },
  { name: "android.permission.BLUETOOTH_ADVERTISE", level: "dangerous", group: "nearby", description: "Advertise to Bluetooth devices (12+)." },
  { name: "android.permission.NEARBY_WIFI_DEVICES", level: "dangerous", group: "nearby", description: "Connect to nearby devices via Wi-Fi." },
  { name: "android.permission.SCHEDULE_EXACT_ALARM", level: "special", description: "Schedule exact alarms." },
  { name: "android.permission.USE_EXACT_ALARM", level: "normal", description: "Use exact alarm APIs for eligible apps." },
  { name: "android.permission.REQUEST_INSTALL_PACKAGES", level: "special", description: "Request install packages permission." },
  { name: "android.permission.SYSTEM_ALERT_WINDOW", level: "special", description: "Draw over other apps." },
  { name: "android.permission.WRITE_SETTINGS", level: "special", description: "Modify system settings." },
  { name: "android.permission.PACKAGE_USAGE_STATS", level: "signature", description: "Access package usage statistics." },
  { name: "android.permission.QUERY_ALL_PACKAGES", level: "signature", description: "Query all installed packages." },
  { name: "com.google.android.c2dm.permission.RECEIVE", level: "normal", description: "Receive FCM / C2DM messages (legacy)." },
  { name: "com.google.android.gms.permission.AD_ID", level: "normal", description: "Access advertising ID." },
  { name: "android.permission.ACCESS_ADSERVICES_ATTRIBUTION", level: "normal", description: "Access AdServices attribution APIs." },
  { name: "android.permission.ACCESS_ADSERVICES_TOPICS", level: "normal", description: "Access AdServices Topics API." },
  { name: "android.permission.NFC", level: "normal", description: "Perform NFC I/O operations." },
  { name: "android.permission.USE_BIOMETRIC", level: "normal", description: "Use biometric hardware." },
  { name: "android.permission.USE_FINGERPRINT", level: "normal", description: "Use fingerprint hardware (legacy)." },
];

export function filterPermissions(
  query: string,
  level?: PermissionLevel | "all"
): AndroidPermission[] {
  const q = query.trim().toLowerCase();
  return ANDROID_PERMISSIONS.filter((p) => {
    if (level && level !== "all" && p.level !== level) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.group?.toLowerCase().includes(q) ?? false)
    );
  });
}

export function manifestSnippet(permission: string): string {
  return `<uses-permission android:name="${permission}" />`;
}
