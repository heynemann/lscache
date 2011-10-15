Introduction
============

lsd.js_ is an in-memory asynchronous persistent cache in javascript. It uses the
localStorage mechanism of the `WebStorage Spec`_. Perhaps we'll provide
alternate implementations in browsers that do not support localStorage.

Dependencies
============

lsd.js_ is a Mootools_ library and as such depends on Mootools_ core.

We've only tested it against Mootools_ 1.4.1 with no compatibility, but since
we use a very thin layer of Mootools_ it might work with other versions.

Usage
=====

Using lsd.js_ is pretty simple::

    var lsd = new Lsd();
    lsd.registerCache('myCachedItem', function(callback) {
        callback("Hello World");
    }, 30);

    lsd.get('myCachedItem', function(data) {
        console.log(data);
    });

The first call, to registerCache, instructs lsd on how to proceed if the
'myCachedItem' data is not found in the cache or is expired, from now on
refered to as a 'CacheMiss'.

The CacheMiss function (the second parameter in the registerCache method) must
be a function in the form fn(callback). It will receive a callback argument
from lsd.js_ so that it may be asynchronous as well (imagine a cached AJAX call
for instance. You would call callback(data) in the success of your AJAX call).

The third argument to the registerCache method is the expiration in seconds of
the cached item.

The get method can be called as many times as needed and all of them will be
queued until the first call resolves and then all of them get the cached data.

As said before, lsd.js_ is an asynchronous cache, meaning the get method
returns immediately and the success function will be called when the data is
available.

Licensing
=========

lsd.js_ is licensed under the The MIT License (MIT)

Copyright (c) 2011 Bernardo Heynemann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

.. _lsd.js: http://lsd.js/
.. _WebStorage Spec: http://dev.w3.org/html5/webstorage/
.. _Mootools: http://mootools.net/
