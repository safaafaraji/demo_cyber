FROM php:7.4-apache
RUN echo '<?php echo "Hello " . $_GET["name"]; ?>' > /var/www/html/index.php
RUN echo "FLAG{XSS_REFLECTED_BYPASS}" > /flag.txt
EXPOSE 80
