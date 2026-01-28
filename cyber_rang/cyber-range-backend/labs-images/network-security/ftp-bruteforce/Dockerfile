FROM alpine:latest
RUN apk add --no-cache vsftpd
RUN echo "admin:password123" | chpasswd
RUN echo "FLAG{FTP_BRUTE_FORCE_SUCCESS}" > /home/admin/flag.txt
COPY <<EOF /etc/vsftpd/vsftpd.conf
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
xferlog_enable=YES
connect_from_port_20=YES
listen=YES
background=NO
EOF
EXPOSE 21
CMD ["vsftpd", "/etc/vsftpd/vsftpd.conf"]
