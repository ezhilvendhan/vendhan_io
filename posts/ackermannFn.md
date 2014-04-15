{{{
    "id"       : "20140415af",
    "title"    : "Ackermann's Function",
    "tags"     : ["sicp", "ackermann", "total computable function"],
    "category" : "Tech",
    "date"     : "2014-04-15",
    "dateText" : "15 Apr 2014"
}}}

I started reading [SICP](http://mitpress.mit.edu/sicp/full-text/book/book.html) only a couple of days ago.
I regret why it took me so long to find such a great book. I do not have a Computer Science degree.
All I learnt so far was either through self-learning or on job. SICP is such a helpful book for people like me.

I came across Ackermann's function in [Chapter 1](http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-11.html#%_sec_1.2.1).
This is the first time I came across it. So, I googled to know the more about it.

Wikipedia says -
_
``
  In computability theory, the Ackermann function, named after Wilhelm Ackermann,
  is one of the simplest and earliest-discovered examples of a total computable function
  that is not primitive recursive. All primitive recursive functions are total and computable,
  but the Ackermann function illustrates that not all total computable functions are primitive recursive.
``
_

In [MIT Scheme](http://www.gnu.org/software/mit-scheme/), the function can be represented as:

```lisp
  (define (A x y)
    (cond ((= y 0) 0)
      ((= x 0) (* 2 y))
      ((= y 1) 2)
      (else (A (- x 1) (A x (- y 1))))
    )
  )
```

Here is the javascript equivalent

```javascript
function ack(x, y) {
  if(y == 0) return 0
  else if(x == 0) return 2*y
  else if(y == 1) return 2
  else return ack(x-1, ack(x, y-1))
}
```

So, *What is a total Computable function?*
  - Any function _f(x)_ that always terminates with an output for every value of x.
    As seen in Ackermann's function above, the function handles all values of the input parameters
    `x` and `y` with 3 equals checks `y=0`, `x=0`, `y=1` and an `else` condition.

Ok, *What is a Primitive recursive function?*
  - One that [completes in a knowable time (simply put, not too long)](http://math.stackexchange.com/questions/96483/ackermann-function-primitive-recursive).
  - It is a type of total recursive function.
  - In programming, primitive recursive function can only be computed using `for` loop where the loop's
    boundaries are defined at run time.

Obviously, Ackermann's function is a non-primitive recursive function. The recursion grows much faster.
Not clear? try computing `A(1, 10)`. Try running step by step. Now try `A(4, 3)`.

The beauty of this function is,
    `(A 0 n)` returns `2n`
    `(A 1 n)` returns `2^n`
    `(A 2 n)` returns `2^{2^{...^{2}}}, for n 2s`

Due to its non-primitive recursive nature, Ackermann's Function is used as a benchmark of a compiler's ability
to optimize recursion.

I intend to write more about other interesting functions or things that I come across in SICP. Stay tuned!
