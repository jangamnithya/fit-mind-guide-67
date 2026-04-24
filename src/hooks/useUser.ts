import { useEffect, useState } from "react";

export type StoredUser = {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  createdAt: string;
};

export function useUser() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aura_user");
      if (raw) setUser(JSON.parse(raw) as StoredUser);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  return { user, loaded };
}
