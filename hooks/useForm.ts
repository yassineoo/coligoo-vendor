import { useCallback, useState } from "react";

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => void;

function setByPath<T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any
): T {
  const keys = path.split(".");
  const out = { ...obj };
  let cur: any = out;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = cur[k] && typeof cur[k] === "object" ? { ...cur[k] } : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return out;
}

export function useForm<T extends Record<string, any>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  const handleChange: ChangeHandler = useCallback((e) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const name = target.name;
    if (!name) return;
    if (target instanceof HTMLInputElement && target.type === "file") {
      const files = target.files;
      setValues((prev) =>
        setByPath(prev, name, files && files.length === 1 ? files[0] : files)
      );
      return;
    }
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setValues((prev) =>
        setByPath(prev, name, (target as HTMLInputElement).checked)
      );
      return;
    }
    if (target instanceof HTMLInputElement && target.type === "number") {
      const val = (target as HTMLInputElement).value;
      const parsed = val === "" ? "" : Number(val);
      setValues((prev) =>
        setByPath(prev, name, Number.isNaN(parsed) ? val : parsed)
      );
      return;
    }
    setValues((prev) => setByPath(prev, name, target.value));
  }, []);

  const setField = useCallback((name: string, value: any) => {
    setValues((prev) => setByPath(prev, name, value));
  }, []);

  const reset = useCallback(
    (next?: T) => {
      setValues(next ?? initial);
    },
    [initial]
  );

  return { values, handleChange, setField, reset, setValues } as const;
}

export default useForm;
