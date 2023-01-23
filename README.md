# nostrogen
simple nostr vanity address generator

[nostrogen.com](http://nostrogen.com/)

usage / performance / security
---------------------
##### what is this thing?

this is a simple vanity key generator for the nostr protocol. choose prefix or suffix, enter allowed characters in the input, and press generate. your keys/addresses will then be generated in the container below for you to copy and save.

##### show me some examples.

here are some example generated address pairs. don't use these ones if you don't want others to also have access. generate your own instead and store them securely.

```
prefix: pre
npub1prep4kxakm43s0hn3fdkdtygmg9fmuf7wy2vj0x0l3zt7xtw03qq8alt6h
nsec1h29hj7xsdwlup8rx78y66txs95ry2tuhwmu633zl4d2l5qwna50splfm3z
08f21ad8ddb6eb183ef38a5b66ac88da0a9df13e7114c93ccffc44bf196e7c40
ba8b7978d06bbfc09c66f1c9ad2cd02d06452f9776f9a8c45fab55fa01d3ed1f

suffix: suf
npub15l6yft4s6fvwr68p97gvgm0aqwyxhyxwtydfujm3rlhsk5frseks33dsuf
nsec10m5qfqwdv0d8286zpnt2uehu5cq4trz4700yfglyth4qj3v76nsq0lsnzu
a7f444aeb0d258e1e8e12f90c46dfd03886b90ce591a9e4b711fef0b5123866d
7ee80481cd63da751f420cd6ae66fca601558c55f3de44a3e45dea09459ed4e0
```

##### why can't we use characters b, i, o, or 1?

the characters have to be in the bech32 character set.



##### how fast will nostrogen find my addresses?

this depends entirely upon how fast your machine is, but here are some rough estimates for a modern laptop or mobile phone:
```
1 character = usually less than a 0.1 seconds
2 characters = usually less than a 1 second
3 characters = usually less than a 30 seconds
4 characters = usually less than a 10 minutes
5 characters = usually less than a 1 hour
6+ characters = keep fire extinguisher handy
```
##### are you going to steal my nostr keys?

nah, but- don't trust, verify. check out the code on github, ask a programmer friend, or- if you're really paranoid, download the source and run this program on a clean computer without internet access. these are just nostr keys though, not bitcoin keys..
