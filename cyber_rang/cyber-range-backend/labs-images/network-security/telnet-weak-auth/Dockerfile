FROM alpine:latest
RUN apk add --no-cache busybox-extras
# Simple telnet server behavior or just an environment with a flag
RUN echo "FLAG{TELNET_WEAK_CRYPTO}" > /root/flag.txt
RUN echo "admin:admin123" | chpasswd
EXPOSE 23
CMD ["telnetd", "-F", "-p", "23"]
