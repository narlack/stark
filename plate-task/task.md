# Queue task

## Task 1
You work for the DMV; you have a specific, sequential way of generating new license plate numbers:

Each license plate number has 6 alphanumeric characters. The numbers always come before the letters.

The first plate number is 000000, followed by 000001...
When you arrive at 999999, the next entry would be 00000A, Followed by 00001A...
When you arrive at 99999A, the next entry is 00000B, Followed by 00001B...
After following the pattern to 99999Z, the next in the sequence would be 0000AA...

When 9999AA is reached, the next in the series would be 0000AB...0001AB
When 9999AB is reached, the next in the series would be 0000AC...0001AC
When 9999AZ is reached, the next in the series would be 0000BA...0001BA
When 9999ZZ is reached, the next in the series would be 000AAA...001AAA

And so on untill the sequence completes with ZZZZZZ.

So the pattern overview looks a bit like this:

000000</br>
000001</br>
...</br>
999999</br>
00000A</br>
00001A</br>
...</br>
99999A</br>
00000B</br>
00001B</br>
...</br>
99999Z</br>
0000AA</br>
0001AA</br>
...</br>
9999AA</br>
0000AB</br>
0001AB</br>
...</br>
9999AB</br>
0000AC</br>
0001AC</br>
...</br>
9999AZ</br>
0000BA</br>
0001BA</br>
...</br>
9999BZ</br>
0000CA</br>
0001CA</br>
...</br>
9999ZZ</br>
000AAA</br>
001AAA</br>
...</br>
999AAA</br>
000AAB</br>
001AAB</br>
...</br>
999AAZ</br>
000ABA</br>
...</br>
ZZZZZZ</br>


The goal is to write the most efficient function that can return the nth element in this sequence.
