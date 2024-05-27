

export const checkIsValidToken = async (token: string) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const validateResponse = await fetch(`${process.env.AUTH_API_BASE_URL}/auth/introspect`, {
        method: 'POST',
        headers,
        body: JSON.stringify({token}),
        cache: 'no-store'
    });

    const validateResult = await validateResponse.json();
    if (!validateResponse?.ok || !validateResult?.active) {
        return false;
    }
    return true;
}