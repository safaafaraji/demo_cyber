<?php
$servername = "db";
$username = "user";
$password = "password";
$dbname = "vulnerable_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $u = $_POST['username'];
    $p = $_POST['password'];

    // VULNERABLE CODE
    $sql = "SELECT id, username FROM users WHERE username = '$u' AND password = '$p'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        echo "Login Successful! Welcome " . $u;
    } else {
        echo "Login Failed";
    }
}
?>
<form method="POST">
Username: <input type="text" name="username"><br>
Password: <input type="password" name="password"><br>
<input type="submit" value="Login">
</form>
