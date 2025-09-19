package com.github.not.n0w.server;

import com.fastcgi.*;
import com.github.not.n0w.server.model.Point;
import com.github.not.n0w.server.model.Request;
import com.github.not.n0w.server.model.Response;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public class FastCGIServer {
    private final FCGIInterface fcgiInterface;

    public FastCGIServer() {
        fcgiInterface = new FCGIInterface();
    }

    private void dropError(String message) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"status\": ").append("error");
        sb.append("\"message\": \"").append(message).append("\"");
        System.out.println(sb.toString());
        log.error(message);
    }
    private String readInputData() throws IOException {
        FCGIInterface.request.inStream.fill();

        int contentLength = Optional.ofNullable(
                        FCGIInterface.request.params.getProperty("CONTENT_LENGTH")
                ).map(Integer::parseInt)
                .orElse(0);

        byte[] bodyBytes = FCGIInterface.request.inStream.readNBytes(contentLength);

        if (bodyBytes.length != contentLength) {
            throw new IOException("Failed to read full request body");
        }

        return new String(bodyBytes, StandardCharsets.UTF_8);
    }

    private Response processRequest() {
        log.info("Processing request");

        var startTime = System.nanoTime();
        var contentType = FCGIInterface.request.params.getProperty("CONTENT_TYPE");

        if (contentType == null || !contentType.equals("application/x-www-form-urlencoded")) {
            dropError("Content-Type is not applicsation/x-www-form-urlencoded");
            return null;
        }
        String input;
        try {
            input = readInputData();
        } catch (IOException e) {
            dropError(e.getMessage());
            return null;
        }
        Request request;
        try {
            request = Request.parse(input);
        }
        catch (IllegalArgumentException e) {
            dropError(e.getMessage());
            return null;
        }

        List<Point> points = new ArrayList<>();
        for(var xCoordinate : request.getX()) {
            points.add(new Point(
                    xCoordinate,
                    request.getY(),
                    FigureProcessor.hit(xCoordinate, request.getY(), request.getR())
            ));
        }

        var endTime = System.nanoTime();
        Response response = new Response(
                points,
                request.getR(),
                (double) (endTime-startTime),
                String.valueOf(System.currentTimeMillis())
        );

        log.info("Response: \n{}", response.toString());
        return response;
    }

    private void waitForRequest() {
        while (fcgiInterface.FCGIaccept() >= 0) {
            log.info("New request");
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            String uri = FCGIInterface.request.params.getProperty("REQUEST_URI");

            if(!method.equals("POST")) {
                dropError("Method not supported");
            }

            log.info("POST request");
            Response response = processRequest();
            if(response == null) { return; }

            System.out.println("Content-Type: application/json; charset=UTF-8\n\n" +response.toString());
        }
    }

    public void start() {
        log.info("Server started");
        waitForRequest();
    }
}
