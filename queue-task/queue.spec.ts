import { handleQueue } from "./queue";

describe('Queue function', () => {
    test('should return empty array immediate', async () =>{
        const result = await handleQueue([], 1)
        expect(result).toEqual([])
    })

    describe('Incorrect currency number', () => {
        test('should return an error when currency = 0', async () => {
            try {
                await handleQueue([], 0)
            } catch (e: any) {
                expect(e?.message).toEqual(`Maximum concurrency is equal or less then 0`)
            }
        })


        test('should return an error when currency = -1', async () => {
            try {
                await handleQueue([], -1)
            } catch (e: any) {
                expect(e?.message).toEqual(`Maximum concurrency is equal or less then 0`)
            }
        })
    })

    describe('Validate logic of queue', () => {
        let delayTime = 300
        let status = 200
        let fetchMock: any = undefined;

        beforeEach(() => {
            fetchMock = jest.spyOn(global, "fetch").mockImplementation(
                jest.fn(
                    (url) => new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({
                                ok: status === 200,
                                status,
                                json: () => Promise.resolve({ data: url })
                            } as Response)
                        }, delayTime)
                        }),
                ) as jest.Mock
            )
        })

        afterEach(() => {
            delayTime = 300
            status = 200
            jest.clearAllMocks()
        })

        test('should return successful result', async () =>{
            const result = await handleQueue(['example.com/test'], 1)
            expect(result).toEqual([{
                status: "fulfilled",
                value: {
                    data: 'example.com/test'
                }
            }])
            expect(fetchMock).toHaveBeenCalledWith('example.com/test')
        })

        test('fetch should be call all requests in order with concurrency=1', async () => {
            const queue = ['example.com/test', 'example.com/test1', 'example.com/tes2', 'example.com/tes4']
            await handleQueue(queue, 1)
            expect(fetchMock).toHaveBeenCalledTimes(queue.length)
            queue.forEach((url,index ) => {
                expect(fetchMock).toHaveBeenNthCalledWith(index + 1, url)
            })
        })

        test('fetch should be call all requests in order with concurrency=2', async () => {
            const queue = ['example.com/test', 'example.com/test1', 'example.com/tes2', 'example.com/tes4']
            await handleQueue(queue, 2)
            expect(fetchMock).toHaveBeenCalledTimes(queue.length)
            queue.forEach((url,index ) => {
                expect(fetchMock).toHaveBeenNthCalledWith(index + 1, url)
            })
        })

        test('should be executed in delayed time', async () => {
            delayTime = 1000
            const startTime = Date.now()
            const result = await handleQueue(['example.com/test'], 1)
            const endTime = Date.now()
            const executionTime = endTime - startTime
            expect(executionTime % delayTime).toBeLessThan(150)
        })

        test('execution time should be more or less the same as queue size', async () => {
            const startTime = Date.now()
            const queue = ['example.com/test', 'example.com/test1', 'example.com/tes2']
            const result = await handleQueue(queue, 1)
            const endTime = Date.now()
            const estimatedRequestNumber = Math.floor((endTime - startTime) / delayTime)
            expect(estimatedRequestNumber).toEqual(result.length)
        })

        test('execution time should be faster then queue size', async () => {
            const concurrency = 2
            const startTime = Date.now()
            const queue = ['example.com/test', 'example.com/test1', 'example.com/tes2', 'example.com/tes4']
            const result = await handleQueue(queue, concurrency)
            const endTime = Date.now()
            const estimatedRequestNumber = Math.floor((endTime - startTime) / delayTime)
            expect(estimatedRequestNumber).toEqual(result.length / concurrency)
        })

        test('handle failed http request', async () => {
            status = 404
            const result = await handleQueue(['example.com/test'], 1)
            expect(result).toEqual([{
                status: "rejected",
                reason: `Response status: ${status}`
            }])
        })
    })
})