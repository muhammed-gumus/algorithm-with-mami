# HackerRank - A Very Big Sum
#
# Calculate and print the sum of array elements, considering that some values
# can be very large. Python handles arbitrarily large integers natively.

import os

def aVeryBigSum(ar):
    return sum(ar)

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')
    ar_count = int(input().strip())
    ar = list(map(int, input().rstrip().split()))
    result = aVeryBigSum(ar)
    fptr.write(str(result) + '\n')
    fptr.close()
