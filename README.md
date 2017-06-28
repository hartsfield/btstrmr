#BTSTRMR

Requires node 0.10.26

todo: finish readme
      build.sh

browserify . -o ./build/main.min.js
cleancss -o ./build/main.min.css ./css/main.css

auth/
  -cert.pem
  -chain.pem
  -privkey.pem
(use LetsEncrypt)
