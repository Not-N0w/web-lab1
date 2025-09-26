package com.github.not.n0w.server;


import java.math.BigDecimal;
import java.math.RoundingMode;

public class FigureProcessor {
    public static boolean hit(BigDecimal x, BigDecimal y, BigDecimal r) {
        boolean hit = false;
        if (x.compareTo(BigDecimal.ZERO) >= 0 && y.compareTo(BigDecimal.ZERO) >= 0) {
            hit = y.compareTo(r.divide(BigDecimal.valueOf(2), 100, RoundingMode.HALF_UP)) <= 0 && x.compareTo(r) <= 0;
        }

        if (x.compareTo(BigDecimal.ZERO) <= 0 && y.compareTo(BigDecimal.ZERO) >= 0) {
            hit = hit || y.compareTo(x.add(r)) <= 0;
        }

        if (x.compareTo(BigDecimal.ZERO) <= 0 && y.compareTo(BigDecimal.ZERO) <= 0) {
            hit = hit || x.multiply(x).add(y.multiply(y)).compareTo(r.multiply(r)) <= 0;
        }

        return hit;
    }
}