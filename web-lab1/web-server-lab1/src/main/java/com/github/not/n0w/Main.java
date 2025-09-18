package com.github.not.n0w;


import com.github.not.n0w.server.FastCGIServer;
import com.github.not.n0w.server.FigureProcessor;

public class Main {
    public static void main(String[] args) {
        System.setProperty("FCGI_PORT", "9000");
        FastCGIServer server = new FastCGIServer();
        server.start();
    }
}
