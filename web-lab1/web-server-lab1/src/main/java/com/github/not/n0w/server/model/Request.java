package com.github.not.n0w.server.model;

import lombok.Data;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Data
public class Request {
    private List<Float> x;
    private Float y;
    private Float r;

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
                if(params.containsKey(key)) {
                    params.get(key).add(value);
                }
                else {
                    List<String> values = new ArrayList<>();
                    values.add(value);
                    params.put(key, values);
                }
            }
        }
        return params;
    }

    private static List<Float> parseFloatList(List<String> values, String fieldName) {
        if (values == null) return null;
        try {
            return values.stream()
                    .map(Float::valueOf)
                    .toList();
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in field '" + fieldName + "'", e);
        }
    }

    private static Float parseFirstFloat(List<String> values, String fieldName) {
        if (values == null || values.isEmpty()) return null;
        try {
            return Float.valueOf(values.getFirst());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number in field '" + fieldName + "'", e);
        }
    }
}
