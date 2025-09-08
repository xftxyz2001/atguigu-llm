package com.atguigu.study.controller;

import cn.hutool.core.date.DateUtil;
import com.atguigu.study.service.FunctionAssistant;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @auther zzyybs@126.com
 * @Date 2025-06-02 17:01
 * @Description: TODO
 */
@RestController
@Slf4j
public class ChatFunctionCallingController
{
    @Resource
    private FunctionAssistant functionAssistant;

    //  http://localhost:9011/chatfunction/test1
    @GetMapping(value = "/chatfunction/test1")
    public String test1()
    {
        String chat = functionAssistant.chat("开张发票,公司：尚硅谷教育科技有限公司 税号：atguigu533 金额：668.12");

        System.out.println(chat);

        return "success : "+ DateUtil.now() + "\t"+chat;
    }
}
