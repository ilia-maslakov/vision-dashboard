import { BASE } from "./authToken";
import { fetchJson } from "./fetchJson";

export async function ensureProxy(
  folderId: string,
  proxy: any,
): Promise<string> {
  const listUrl = `${BASE}/folders/${folderId}/proxies`;
  const proxyList = (await fetchJson(listUrl)).data.items ?? [];

  const found = proxyList.find(
    (p: any) =>
      p.proxy_ip === proxy.proxy_ip &&
      p.proxy_port === proxy.proxy_port &&
      p.proxy_username === proxy.proxy_username &&
      p.proxy_password === proxy.proxy_password,
  );

  if (found) return found.id;

  const createUrl = `${BASE}/folders/${folderId}/proxies`;
  const body = {
    proxies: [
      {
        proxy_name: proxy.proxy_name,
        proxy_type: proxy.proxy_type || "HTTP",
        proxy_ip: proxy.proxy_ip,
        proxy_port: proxy.proxy_port,
        proxy_username: proxy.proxy_username,
        proxy_password: proxy.proxy_password,
      },
    ],
  };

  const result = await fetchJson(createUrl, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return result.data[0].id;
}
