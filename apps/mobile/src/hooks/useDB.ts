import { Registry } from "@media-app/core/interfaces/Registry";
import { useEffect, useState } from "react";
import { initDB } from "src/db";


export function useDB() {
  const [isReady, setReady] = useState(false);
  useEffect(() => {


    setReady(true);
  }, []);

  return isReady;
}