package com.atguigu.study.service;

import reactor.core.publisher.Flux;

/**
 * @auther zzyybs@126.com
 * @Date 2025-06-02 21:39
 * @Description: TODO
 */
public interface McpService
{
    Flux<String> chat(String question);
}
