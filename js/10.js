(() => {
  const adapters = [84, 60, 10, 23, 126, 2, 128, 63, 59, 69, 127, 73, 140, 55, 154, 133, 36, 139, 4, 70, 110, 97, 153, 105, 41, 106, 79, 145, 35, 134, 146, 148, 13, 77, 49, 107, 46, 138, 88, 152, 83, 120, 52, 114, 159, 158, 53, 76, 16, 28, 89, 25, 42, 66, 119, 3, 17, 67, 94, 99, 7, 56, 85, 122, 18, 20, 43, 160, 54, 113, 29, 130, 19, 135, 30, 80, 116, 91, 161, 115, 141, 102, 37, 157, 129, 34, 147, 142, 151, 68, 78, 24, 90, 121, 123, 33, 98, 1, 40]

  const sortedAdapters = adapters.sort((a, b) => a > b ? 1 : -1)

  const buildInAdapter = Math.max.apply(null, sortedAdapters) + 3

  const joltages = [0, ...sortedAdapters, buildInAdapter]

  const differences = () => {
    return joltages.reduce((diffs, adapter, index) => {
      if (index === joltages.length - 1) {
        return diffs
      }
      const diff = joltages[index + 1] - adapter
      if (diff === 1) {
        diffs.one += 1
        return diffs
      }
      if (diff === 2) {
        diffs.two += 1
        return diffs
      }
      if (diff === 3) {
        diffs.three += 1
        return diffs
      }
      throw Error('Invalid diff: ' + JSON.stringify({ adapters, adapter, index, next: adapters[index + 1], diff }))
    }, { one: 0, two: 0, three: 0})
  }

  const first = differences().one * differences().three

  const availableIncrements = index => {
    return [1, 2, 3].filter(i => joltages[index + i] - joltages[index] <= 3)
  }

  const joltageSequences = () => {
    let sequence = []
    return joltages.slice(0, joltages.length - 1).reduce((sequences, joltage, index) => {
      sequence.push(joltage)
      const endOfSequence = joltages[index + 1] - joltage === 3
      if (endOfSequence) {
        if (sequence.length > 2) {
          sequences.push([...sequence])
        }
        sequence = []
      }
      return sequences
    }, [])
  }

  const getFirstUnfinishedSequenceCombinationIndex = (sequence, combinations) => combinations.findIndex(c => c[c.length - 1] !== sequence[sequence.length - 1])

  const sequenceCombinations = sequence => {
    let combinations = [[sequence[0]]]
    while (getFirstUnfinishedSequenceCombinationIndex(sequence, combinations) !== -1) {
      combinations = addSequenceAdapter(sequence, combinations)
    }
    return combinations.length
  }

  const addSequenceAdapter = (sequence, combinations) => {
    const firstUnfinishedCombinationIndex = getFirstUnfinishedSequenceCombinationIndex(sequence, combinations)
    const firstUnfinishedCombination = combinations[firstUnfinishedCombinationIndex]
    if (!firstUnfinishedCombination) {
      throw new Error('All combos are finished')
    }
    const lastAdapter = firstUnfinishedCombination[firstUnfinishedCombination.length - 1]
    const lastAdapterIndex = sequence.findIndex(j => j === lastAdapter)
    const availableNextAdapterIndexIncrements = [1, 2, 3].filter(i => sequence[lastAdapterIndex + i] - lastAdapter <= 3)
    if (availableNextAdapterIndexIncrements.length === 0) {
      throw new Error('No next adapter')
    }
    combinations[firstUnfinishedCombinationIndex] = [
      ...firstUnfinishedCombination,
      sequence[lastAdapterIndex + availableNextAdapterIndexIncrements[0]]
    ]
    if (availableNextAdapterIndexIncrements.length > 1) {
      availableNextAdapterIndexIncrements.slice(1).forEach(availableNextAdapterIndexIncrement => {
        combinations = [
          ...combinations,
          [
            ...firstUnfinishedCombination,
            sequence[lastAdapterIndex + availableNextAdapterIndexIncrement]
          ]
        ]
      })
    }
    return combinations
  }

  const countCombinations = () => {
    return joltageSequences().reduce((count, sequence) => {
      return count * sequenceCombinations(sequence)
    }, 1)
  }

  const second = countCombinations()

  show(10, first, second)
})()
