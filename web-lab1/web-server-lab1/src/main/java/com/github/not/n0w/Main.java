package com.github.not.n0w;


import com.github.not.n0w.server.FastCGIServer;

public class Main {
    public static void main(String[] args) {
        System.setProperty("FCGI_PORT", "7615");
        FastCGIServer server = new FastCGIServer();
        server.start();
    }
}
