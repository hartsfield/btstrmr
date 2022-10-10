[//]: # (Copyright (c) 2017 J. Hartsfield)

[//]: # (Permission is hereby granted, free of charge, to any person obtaining a copy)
[//]: # (of this software and associated documentation files (the "Software"), to deal)
[//]: # (in the Software without restriction, including without limitation the rights)
[//]: # (to use, copy, modify, merge, publish, distribute, sublicense, and/or sell)
[//]: # (copies of the Software, and to permit persons to whom the Software is)
[//]: # (furnished to do so, subject to the following conditions:)

[//]: # (The above copyright notice and this permission notice shall be included in all)
[//]: # (copies or substantial portions of the Software.)

[//]: # (THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR)
[//]: # (IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,)
[//]: # (FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE)
[//]: # (AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER)
[//]: # (LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,)
[//]: # (OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE)
[//]: # (SOFTWARE.)

# BTSTRMR

A music blog built with React+FLUX, MongoDB, Express, and other industry 
standard components.

Requires node >=0.10.26.

![preview](https://i.imgur.com/XDzATQf.png)


For initial deployments and after server restarts run:

    $ ./initial_deployment.sh

This shell script will run a number of commands to set up the server. After this
is run, the code is built and the server is started with this command:

    $ ./start.sh

To set up ssl, use letsencrypt and save the .pem files generated by letsencrypt 
in the auth/ directory.

```
auth/
  -cert.pem
  -chain.pem
  -privkey.pem
```
