<?php
class ApiSecurity {
    private $encryption_key;
    private $cipher = 'aes-256-cbc';

    public function __construct($key) {
        $this->encryption_key = hash('sha256', $key, true);
    }

    public function encrypt($data) {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($this->cipher));
        $encrypted_data = openssl_encrypt($data, $this->cipher, $this->encryption_key, 0, $iv);
        return base64_encode($encrypted_data . '::' . base64_encode($iv));
    }

    public function decrypt($data) {
        list($encrypted_data, $iv) = explode('::', base64_decode($data), 2);
        $iv = base64_decode($iv);
        return openssl_decrypt($encrypted_data, $this->cipher, $this->encryption_key, 0, $iv);
    }

    public function is_valid_api_key($r, $v) {
        return hash_equals($r, $v);
    }
}
?>