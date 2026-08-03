export type AdbTemplateId =
  | "devices"
  | "install"
  | "uninstall"
  | "clear"
  | "deep-link"
  | "logcat"
  | "screenshot"
  | "battery"
  | "permissions"
  | "force-stop"
  | "monkey"
  | "wifi-adb";

export interface AdbFormState {
  packageName: string;
  apkPath: string;
  deepLink: string;
  activity: string;
  deviceId: string;
  logTag: string;
  permission: string;
}

export const ADB_TEMPLATES: {
  id: AdbTemplateId;
  label: string;
  description: string;
}[] = [
  { id: "devices", label: "List devices", description: "Show connected devices / emulators" },
  { id: "install", label: "Install APK", description: "Install or reinstall an APK" },
  { id: "uninstall", label: "Uninstall app", description: "Remove package from device" },
  { id: "clear", label: "Clear app data", description: "pm clear package storage" },
  { id: "deep-link", label: "Open deep link", description: "Start activity via VIEW intent" },
  { id: "logcat", label: "Logcat filter", description: "Filter logs by tag / package" },
  { id: "screenshot", label: "Screenshot", description: "Capture screen to PNG" },
  { id: "battery", label: "Battery stats", description: "Dump battery information" },
  { id: "permissions", label: "Grant permission", description: "Grant runtime permission" },
  { id: "force-stop", label: "Force stop", description: "Force-stop the application" },
  { id: "monkey", label: "Monkey test", description: "Run UI stress events" },
  { id: "wifi-adb", label: "Wireless ADB", description: "Connect over TCP/IP" },
];

function deviceFlag(deviceId: string): string {
  return deviceId.trim() ? `-s ${deviceId.trim()} ` : "";
}

export function generateAdbCommand(
  template: AdbTemplateId,
  state: AdbFormState
): string {
  const d = deviceFlag(state.deviceId);
  const pkg = state.packageName.trim() || "com.example.app";
  const apk = state.apkPath.trim() || "./app-release.apk";
  const link = state.deepLink.trim() || "https://example.com/product/1";
  const activity = state.activity.trim() || `${pkg}/.MainActivity`;
  const tag = state.logTag.trim() || "MyApp";
  const permission =
    state.permission.trim() || "android.permission.POST_NOTIFICATIONS";

  switch (template) {
    case "devices":
      return "adb devices -l";
    case "install":
      return `adb ${d}install -r "${apk}"`;
    case "uninstall":
      return `adb ${d}uninstall ${pkg}`;
    case "clear":
      return `adb ${d}shell pm clear ${pkg}`;
    case "deep-link":
      return `adb ${d}shell am start -a android.intent.action.VIEW -d "${link}" ${pkg}`;
    case "logcat":
      return `adb ${d}logcat -s ${tag}:* *:S\n# Or by package:\nadb ${d}shell pidof ${pkg} | xargs -I{} adb ${d}logcat --pid={}`;
    case "screenshot":
      return `adb ${d}shell screencap -p /sdcard/screen.png && adb ${d}pull /sdcard/screen.png ./screen.png`;
    case "battery":
      return `adb ${d}shell dumpsys battery`;
    case "permissions":
      return `adb ${d}shell pm grant ${pkg} ${permission}`;
    case "force-stop":
      return `adb ${d}shell am force-stop ${pkg}`;
    case "monkey":
      return `adb ${d}shell monkey -p ${pkg} -v 100`;
    case "wifi-adb":
      return `# USB first, then:\nadb tcpip 5555\nadb connect DEVICE_IP:5555\nadb devices`;
    default:
      return "adb devices";
  }
}
