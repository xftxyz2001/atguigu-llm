package com.atguigu.ai.chat.controller;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ChatModelController {

    @Autowired
    private ChatModel chatModel;

    //提示词操作
    // name：名字
    // voice: 习惯
    @GetMapping("/prompt")
    public String prompt(@RequestParam("name")
                             String name,
                         @RequestParam("voice")
                             String voice) {
        //设置用户输入信息
        String userText = """
            给我推荐北京的至少三种美食
            """;
        UserMessage userMessage = new UserMessage(userText);

        //设置系统提示信息
        String systemText= """
            你是一个美食咨询助手，可以帮助人们查询美食信息。
            你的名字是{name},
            你应该用你的名字和{voice}的饮食习惯回复用户的请求。
            """;
        //使用Prompt Template 设置信息
        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemText);

        //替换占位符
        Message systemMessage =
                systemPromptTemplate
                        .createMessage(Map.of("name", name, "voice", voice));

        //使用Prompt封装
        Prompt prompt = new Prompt(List.of(userMessage,systemMessage));

        //调用chatModel方法
        ChatResponse response = chatModel.call(prompt);
        List<Generation> results = response.getResults();
        return
                results.stream().map(x->x.getOutput().getContent())
                        .collect(Collectors.joining(""));
    }

    //String call(String message)
    @GetMapping("/chatModel01")
    public String chatModel01(@RequestParam("msg") String msg) {
        String result = chatModel.call(msg);
        return result;
    }

    //ChatResponse call(Prompt prompt);
    @GetMapping("/chatModel02")
    public String chatModel02(@RequestParam("msg") String msg) {
        ChatResponse chatResponse = chatModel.call(
                new Prompt(
                        msg,
                        OpenAiChatOptions.builder()
                                .model("deepseek-chat")
                                .temperature(0.8)
                                .build()
                )
        );
        String content = chatResponse.getResult().getOutput().getContent();
        return content;
    }
}
