package com.github.not.n0w.server;


public class FigureProcessor {
    public static boolean hit(float x, float y, float r) {
        if (x >= 0 && y >= 0) return (x <= r / 2 && y <= r);
        if (x <= 0 && y >= 0) return (y <= x + r);
        if (x <= 0 && y <= 0) return (x * x + y * y <= r * r);
        return false;
    }
}