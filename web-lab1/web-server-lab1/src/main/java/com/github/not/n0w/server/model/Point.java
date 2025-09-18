package com.github.not.n0w.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Point {
    private Float x;
    private Float y;
    private boolean isHit;
}
