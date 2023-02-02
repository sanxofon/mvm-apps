<?php
function is_localhost() {

    $server_ip = null;

    if ( defined( 'INPUT_SERVER' ) && filter_has_var( INPUT_SERVER, 'REMOTE_ADDR' ) ) {
        $server_ip = filter_input( INPUT_SERVER, 'REMOTE_ADDR', FILTER_VALIDATE_IP );
    } elseif ( defined( 'INPUT_ENV' ) && filter_has_var( INPUT_ENV, 'REMOTE_ADDR' ) ) {
        $server_ip = filter_input( INPUT_ENV, 'REMOTE_ADDR', FILTER_VALIDATE_IP );
    } elseif ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
        $server_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP );
    }

    if ( empty( $server_ip ) ) {
        $server_ip = '127.0.0.1';
    }
    //return $server_ip;
    return empty( filter_var( $server_ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_RES_RANGE | FILTER_FLAG_NO_PRIV_RANGE ));
}