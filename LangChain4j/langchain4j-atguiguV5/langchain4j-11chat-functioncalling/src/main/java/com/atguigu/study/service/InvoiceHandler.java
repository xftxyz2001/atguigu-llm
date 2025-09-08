package com.atguigu.study.service;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;

/**
 * @auther zzyy
 * @create 2025-03-12 23:28
 * 知识出处，https://docs.langchain4j.dev/tutorials/tools/#tool
 */
@Slf4j
public class InvoiceHandler
{

    @Tool("根据用户提交的开票信息进行开票")
    public String handle(@P("公司名称") String companyName,
                         @P("税号") String dutyNumber,
                         @P("金额保留两位有效数字") String amount) throws Exception
    {
        log.info("companyName =>>>> {} dutyNumber =>>>> {} amount =>>>> {}", companyName, dutyNumber, amount);
        //----------------------------------
        // 这块写自己的业务逻辑，调用redis/rabbitmq/kafka/mybatis/顺丰单据/医疗化验报告/支付接口等第3方
        //----------------------------------
        System.out.println(new WeatherService().getWeatherV2("101010100"));

        return "开票成功";
    }
}
