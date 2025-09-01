const INITIAL_LETTER = 'A'
const LAST_ALLOWED_LETTER = 'Z'

let plateNumber = '000000'

function increment(): string {
    const numberPart = plateNumber.match(/\d+/g)?.[0]
    const currentNumber: number = Number(numberPart)
    const listOfSymbols: string[] = plateNumber.match(/[A-Z]/g) ?? []
    const isAllZValues: boolean = listOfSymbols.every(letter => letter === LAST_ALLOWED_LETTER)

    if (listOfSymbols.length === plateNumber.length && isAllZValues) {
        throw new Error('we reached limits of plate numbers')
    }

    function addZeroToLeft(value: string): string {
        return value.padStart(plateNumber.length, '0')
    }

    if (isNaN(currentNumber) || (/^(9)+$/g.test(`${numberPart}`) && currentNumber !== 0)) {
        if (isAllZValues || listOfSymbols.length === 0) {
            return addZeroToLeft(INITIAL_LETTER.repeat(listOfSymbols.length + 1))
        }

        // I have used a new function findLast which required latest js version
        // But if it is not allowed I will go basic loop
        const lastNotZValueIndex = listOfSymbols.findLastIndex(letter => letter !== LAST_ALLOWED_LETTER)
        listOfSymbols[lastNotZValueIndex] = String.fromCharCode(listOfSymbols[lastNotZValueIndex].charCodeAt(0) + 1)

        return addZeroToLeft(listOfSymbols.join(''))
    }

    return addZeroToLeft((currentNumber + 1) + listOfSymbols.join(''))
}

plateNumber = increment()
console.log('Should increment number: ', plateNumber === '000001')
plateNumber = '000009'
plateNumber = increment()
console.log('Should NOT change number to initial letter: ', plateNumber === '000010')
plateNumber = '999999'
plateNumber = increment()
console.log('Should change numbers to initial letter: ', plateNumber === '00000A')
plateNumber = '00000A'
plateNumber = increment()
console.log('Should change number before letter: ', plateNumber === '00001A')
plateNumber = '99999A'
plateNumber = increment()
console.log('Should change initial letter to following letter: ', plateNumber === '00000B')
plateNumber = '99999Z'
plateNumber = increment()
console.log('Should handle situation when reach last allowed letter: ', plateNumber === '0000AA')
try {
    plateNumber = 'ZZZZZZ'
    plateNumber = increment()
} catch (e: any) {
    console.log('Should handle when we reach limit of plate numbers: ', e.message === 'we reached limits of plate numbers')
}