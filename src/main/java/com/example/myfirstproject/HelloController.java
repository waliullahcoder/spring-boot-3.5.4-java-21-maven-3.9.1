package com.example.myfirstproject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Wali, Spring Boot!";
    }
}
//http://localhost:8080/hello
//Hello Wali, Spring Boot!