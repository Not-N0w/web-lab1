package com.github.not.n0w.server.model;

import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Data
public class Request {
    private List<BigDecimal> x;
    private BigDecimal y;
    private BigDecimal r;

    public static Request parse(String content)  throws IllegalArgumentException{
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content is null or empty");
        }

        Map<String, List<String>> params = parseParams(content);

        Request request = new Request();
        request.setX(parseFloatList(params.get("x"), "x"));
        request.setY(parseFirstFloat(params.get("y"), "y"));
        request.setR(parseFirstFloat(params.get("r"), "r"));

        return request;
    }

    private static Map<String, List<String>> parseParams(String content) {
        Map<String, List<String>> params = new HashMap<>();
        String[] pairs = content.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=", 2);
            if (keyValue.length == 2) {
                String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
                String value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);

                List<String> values = List.of(value.split(","));
                params.put(key, values);
            }
        }
        return params;
    }

    private static List<BigDecimal> parseFloatList(List<String> values, String fieldName) {
        if (values == null) return null;
        try {
            return values.stream()
                    .map(BigDecimal::new)
                    .toList();
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in field '" + fieldName + "'", e);
        }
    }

    private static BigDecimal parseFirstFloat(List<String> values, String fieldName) {
        if (values == null || values.isEmpty()) return null;
        try {
            return new BigDecimal(values.get(0));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in field '" + fieldName + "'", e);
        }
    }


    public void selfValidate() {
        if (r == null || x == null || y == null) {
            throw new IllegalArgumentException("Request fields must not be null");
        }

        BigDecimal upperBound = r.negate()
                .divide(BigDecimal.valueOf(0.6), 2,  RoundingMode.HALF_UP)
                .add(BigDecimal.valueOf(0.1));

        BigDecimal lowerBound = r
                .divide(BigDecimal.valueOf(0.6), 2,  RoundingMode.HALF_UP)
                .subtract(BigDecimal.valueOf(0.1));

        for (BigDecimal el : x) {
            if (el.compareTo(upperBound) < 0 || el.compareTo(lowerBound) > 0) {
                throw new IllegalArgumentException("Invalid value of x: '" + el + "'");
            }
        }

        if (y.compareTo(upperBound) < 0 || y.compareTo(lowerBound) > 0) {
            throw new IllegalArgumentException("Invalid value of y: '" + y + "'");
        }
    }
}
