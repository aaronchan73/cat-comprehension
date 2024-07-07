from typing import List

def twoSum(nums, target: int) -> List[int]:
    numToIndex = {}
    for index, num in enumerate(nums):
        complement = target - num
        if complement in numToIndex:
            return [numToIndex[complement], index]
        numToIndex[num] = index
    return []

twoSum([1, 2, 3, -1], 0)