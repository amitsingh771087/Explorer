import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createclerksupabaseClient } from "../lib/supabase";

export function usesupabase() {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createclerksupabaseClient(() => getToken()),
    [getToken],
  );

  return client;
}
