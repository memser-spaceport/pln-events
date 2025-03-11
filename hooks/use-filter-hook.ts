"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryValue = string | number | boolean;
type QueryParams = Record<string, QueryValue>;

const useFilterHook = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

    const params = new URLSearchParams(searchParams);

    const setQuery = (
        keyOrParams: string | QueryParams,
        value?: QueryValue
    ) => {
        try {
            if (typeof keyOrParams === 'string' && value !== undefined) {
                // Handle single key-value pair
                params.set(keyOrParams, String(value));
            } else if (typeof keyOrParams === 'object') {
                // Handle multiple key-value pairs
                Object.entries(keyOrParams).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) {
                        params.set(key, String(val));
                    }
                });
            } else {
                throw new Error('Invalid arguments provided to setQuery');
            }
            push(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (error) {
            console.error('Error setting query parameters:', error);
            // You might want to handle errors differently based on your needs
        }
    };

    const clearQuery = (key: string) => {
        try {
            params.delete(key);
            push(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (error) {
            console.error('Error clearing query parameter:', error);
        }
    };

    const clearAllQuery = () => {
        try {
            const viewType = params.get("viewType");
            let path = pathname;
            if (viewType) {
                path = `${path}?viewType=${viewType}`;
            }
            push(path, { scroll: false });
        } catch (error) {
            console.error('Error clearing all query parameters:', error);
        }
    };

    return {
        setQuery,
        clearQuery,
        clearAllQuery,
        searchParams
    } as const;
};

export default useFilterHook;