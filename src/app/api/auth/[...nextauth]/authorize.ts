import bcrypt from "bcrypt";

import { loadUsers } from "./authOptions";

export async function authorize(credentials: {
  username: string;
  password: string;
}) {
  const users = loadUsers();

  const user = users.find((u) => u.username === credentials?.username);
  if (user && (await bcrypt.compare(credentials.password, user.passwordHash))) {
    return { id: user.username, name: user.username };
  }

  return null;
}
