export const APP_CONFIG = {
  appName: "Li Hancong Workspace",
  productionDomain: "https://www.lihancong.com",

  // Supabase 项目创建后，只需要填写下面两项即可启用真实登录。
  // Publishable Key / anon key 可以放在前端；不要在这里填写 service_role、secret key 或数据库密码。
  supabaseUrl: "",
  supabasePublishableKey: ""
};

export function isAuthConfigured() {
  return Boolean(
    APP_CONFIG.supabaseUrl &&
    APP_CONFIG.supabasePublishableKey &&
    APP_CONFIG.supabaseUrl.startsWith("https://")
  );
}
