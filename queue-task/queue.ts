export async function handleQueue(urls: string[], maxConcurrency: number) {
    if (maxConcurrency <= 0) {
        throw new Error(`Maximum concurrency is equal or less then 0`);
    }

    const queue = [...urls]
    const inProgress: string[] = [];

    const promises = urls.map(
        url => new Promise<unknown>((resolve, reject) => {
            const intervalID = setInterval(async() => {
                if (inProgress.length < maxConcurrency) {
                    inProgress.push(url)
                    const currentUrlIndex = queue.findIndex(value => value === url)
                    queue.splice(currentUrlIndex,1)
                    clearInterval(intervalID)

                    try {
                        const response = await fetch(url);

                        if (!response.ok) {
                            throw new Error(`Response status: ${response.status}`);
                        }
                        resolve(await response.json())
                    } catch (error: any) {
                        reject(error?.message  ?? 'Unknown error occurred');
                    }

                    const indexInProgress = inProgress.findIndex(value => value === url)
                    inProgress.splice(indexInProgress,1)
                }
            }, 100)
        })
    )

    return await Promise.allSettled(promises)
}