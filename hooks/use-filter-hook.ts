"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";



const useFilterHook = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace, push, refresh} = useRouter();

    const params = new URLSearchParams(searchParams);
    const setQuery = (key: string, value: string) => {
        params.set(key, value);
        push(`${pathname}?${params.toString()}`);
    }

    const clearQuery = (key: string) => {
        params.delete(key);
        push(`${pathname}?${params.toString()}`);
    }
    const clearAllQuery = () => {
        let path = pathname;
        if(params.get("viewType")) {
            path = `${path}?viewType=${params.get("viewType")}`;
        }
        push(path);
    }

    return { setQuery, clearQuery, clearAllQuery, searchParams}

}

export default useFilterHook;