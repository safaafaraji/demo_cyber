FROM php:7.4-apache
RUN echo '<?php system("ping -c 1 " . $_GET["ip"]); ?>' > /var/www/html/ping.php
RUN echo "FLAG{CMD_INJECTION_ROOT_PWN}" > /root_flag.txt
EXPOSE 80
