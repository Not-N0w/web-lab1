package com.github.not.n0w.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Response {
    private List<Point> points;
    private Float r;
    private Double executionTime;
    private String currentTime;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"status\": ").append("ok");
        sb.append("\"points\": [");
        if (points != null) {
            for (int i = 0; i < points.size(); i++) {
                sb.append(points.get(i).toString());
                if (i < points.size() - 1) sb.append(", ");
            }
        }
        sb.append("], ");
        sb.append("\"r\": ").append(r != null ? r : "null").append(", ");
        sb.append("\"executionTime\": ").append(executionTime != null ? executionTime : "null").append(", ");
        sb.append("\"currentTime\": \"").append(currentTime != null ? currentTime : "").append("\"");
        sb.append("}");
        return sb.toString();
    }

}
