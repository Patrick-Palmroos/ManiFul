package com.ManiFul.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Value("${raspberry.pi.url}")
    private String raspberryPiUrl;

    @GetMapping("/connection")
    public ResponseEntity<String> testConnection() {
        //return ResponseEntity.ok("backend reached");
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(raspberryPiUrl + "/ping", String.class);
            return ResponseEntity.ok("Connected to Raspberry Pi: " + response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Connection failed: " + e.getMessage());
        }
    }
}
