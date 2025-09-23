package com.github.not.n0w.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@AllArgsConstructor
@Data
public class Point {
    private BigDecimal x;
    private BigDecimal y;
    private boolean isHit;

    @Override
    public String toString() {
        return String.format("{\"x\": %s, \"y\": %s, \"isHit\": %s}", x, y, isHit);
    }
}
