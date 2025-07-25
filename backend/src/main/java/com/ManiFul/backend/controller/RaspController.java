package com.ManiFul.backend.controller;

import com.ManiFul.backend.model.Type;
import com.fasterxml.jackson.core.type.TypeReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receipts")
public class RaspController {
    private static final Logger logger = LoggerFactory.getLogger(RaspController.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${raspberry.api.key}")
    private String raspberryApiKey;

    @Value("${raspberry.pi.url}")
    private String raspberryPiUrl;

    public RaspController(RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper) {
        this.restTemplate = restTemplateBuilder.connectTimeout(Duration.ofSeconds(130)).readTimeout(Duration.ofSeconds(130))
                .build();
        this.objectMapper = objectMapper;
    }

    @PostMapping("/parse")
    public ResponseEntity<?> parseReceipt(
            @RequestParam("image") MultipartFile image,
            @RequestParam("types") String typesJson,
            @RequestHeader("Authorization") String authHeader){

        try {
            List<Type> types = objectMapper.readValue(typesJson, new TypeReference<List<Type>>() {});

            // Forward to Raspberry Pi with its specific API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", "Bearer " + raspberryApiKey);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return "receipt.png";
                }
            });
            body.add("types", typesJson);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            String response = restTemplate.postForObject(
                    raspberryPiUrl + "/parse-receipt",
                    requestEntity,
                    String.class
            );

            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Failed to process receipt",
                            "message", e.getMessage()
                    ));
        }
    }
}