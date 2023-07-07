import { usePostHog } from 'posthog-js/react'

function useAppAnalytics() {
    const postHogProps = usePostHog();

    const captureEvent = (eventName, eventParams = {}) => {
        try {

            if (postHogProps?.capture) {
                const allParams = {...eventParams}
                postHogProps.capture(eventName, { ...allParams })
            }
        } catch (e) {
            console.error(e)
        }
    }

    return { captureEvent }
}

export default useAppAnalytics;