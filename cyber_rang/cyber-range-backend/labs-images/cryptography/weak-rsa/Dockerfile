FROM alpine:latest
RUN apk add --no-cache openssl
RUN echo "Keep digging into RSA prime vulnerabilities..." > /README.txt
RUN echo "FLAG{RSA_WEAK_PRIME_FACTOR}" > /flag.txt
CMD ["tail", "-f", "/dev/null"]
