package com.atguigu.study.controller;

import com.atguigu.study.service.McpService;
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.McpTransport;
import dev.langchain4j.mcp.client.transport.stdio.StdioMcpTransport;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * @auther zzyybs@126.com
 * @Date 2025-06-02 21:39
 * @Description: 知识出处
 *
 * 第1步，如何进行mcp编码
 * https://docs.langchain4j.dev/tutorials/mcp#creating-an-mcp-tool-provider
 *
 * 第2步，如何使用baidu map mcp，它提供了哪些功能对外服务
 * https://mcp.so/zh/server/baidu-map/baidu-maps?tab=tools
 *
 * http://localhost:9014/mcp/chat?question=查询61.149.121.66归属地
 * http://localhost:9014/mcp/chat?question=查询北京天气
 * http://localhost:9014/mcp/chat?question=查询昌平到天安门路线规划
 */
@RestController
public class McpCallServerController
{
    @Autowired
    private StreamingChatModel streamingChatModel;


    @GetMapping("/mcp/chat")
    public Flux<String> chat(@RequestParam("question") String question) throws Exception
    {
        /**1.构建McpTransport协议
         *
         * 1.1 cmd：启动 Windows 命令行解释器。
         * 1.2 /c：告诉 cmd 执行完后面的命令后关闭自身。
         * 1.3 npx：npx = npm execute package，Node.js 的一个工具，用于执行 npm 包中的可执行文件。
         * 1.4 -y 或 --yes：自动确认操作（类似于默认接受所有提示）。
         * 1.5 @baidumap/mcp-server-baidu-map：要通过 npx 执行的 npm 包名
         * 1.6 BAIDU_MAP_API_KEY 是访问百度地图开放平台API的AK
        */
        McpTransport transport = new StdioMcpTransport.Builder()
                .command(List.of("cmd", "/c", "npx", "-y", "@baidumap/mcp-server-baidu-map"))
                .environment(Map.of("BAIDU_MAP_API_KEY", System.getenv("BAIDU_MAP_API_KEY")))
                .build();

        // 2.构建McpClient客户端
        McpClient mcpClient = new DefaultMcpClient.Builder()
                .transport(transport)
                .build();

        // 3.创建工具集和原生的FunctionCalling类似
        ToolProvider toolProvider = McpToolProvider.builder()
                .mcpClients(mcpClient)
                .build();

        // 4.通过AiServivces给我们自定义接口McpService构建实现类并将工具集和大模型赋值给AiService
        McpService mcpService = AiServices.builder(McpService.class)
                .streamingChatModel(streamingChatModel)
                .toolProvider(toolProvider)
                .build();


        // 5.调用我们定义的HighApi接口,通过大模型对百度mcpserver调用
        try {
            return mcpService.chat(question);
        } finally {
            mcpClient.close();
        }
    }
}

