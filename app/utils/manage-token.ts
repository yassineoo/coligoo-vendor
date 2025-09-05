export function saveToken(token: string) {
  // save token to cookie
  document.cookie = `vendor-token=${token}; path=/; max-age=86400`; // 1 day
}

export function getToken() {
  const match = document.cookie.match(new RegExp("(^| )vendor-token=([^;]+)"));
  if (match) return match[2];
  return null;
}

export function removeToken() {
  document.cookie = "vendor-token=; path=/; max-age=0";
}
