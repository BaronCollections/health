package com.mintbit.health.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "mintbit.exchange";
    public static final String OCR_QUEUE = "mintbit.ocr.queue";
    public static final String POSTER_QUEUE = "mintbit.poster.queue";
    public static final String AUDIT_QUEUE = "mintbit.audit.queue";

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue ocrQueue() {
        return new Queue(OCR_QUEUE, true);
    }

    @Bean
    public Queue posterQueue() {
        return new Queue(POSTER_QUEUE, true);
    }

    @Bean
    public Queue auditQueue() {
        return new Queue(AUDIT_QUEUE, true);
    }

    @Bean
    public Binding ocrBinding(Queue ocrQueue, DirectExchange exchange) {
        return BindingBuilder.bind(ocrQueue).to(exchange).with("ocr");
    }

    @Bean
    public Binding posterBinding(Queue posterQueue, DirectExchange exchange) {
        return BindingBuilder.bind(posterQueue).to(exchange).with("poster");
    }

    @Bean
    public Binding auditBinding(Queue auditQueue, DirectExchange exchange) {
        return BindingBuilder.bind(auditQueue).to(exchange).with("audit");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
