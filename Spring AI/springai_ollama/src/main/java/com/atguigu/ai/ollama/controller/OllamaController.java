package com.atguigu.ai.ollama.controller;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OllamaController {

    @Autowired
    private OllamaChatModel chatModel;

    @GetMapping("/ollama")
    public String ollama(@RequestParam(value = "message",defaultValue = "hello")
                             String message) {
        String result = chatModel.call(message);
        return result;
    }

}
