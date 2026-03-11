package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "认证接口")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Operation(summary = "发送验证码")
    @PostMapping("/sms/send")
    public Result<Void> sendSmsCode(@RequestBody Map<String, String> body) {
        // TODO: 实现短信验证码发送
        return Result.ok();
    }

    @Operation(summary = "手机号登录/注册")
    @PostMapping("/login/phone")
    public Result<Map<String, Object>> loginByPhone(@RequestBody Map<String, String> body) {
        // TODO: 实现手机号验证码登录，不存在则自动注册
        return Result.ok();
    }

    @Operation(summary = "刷新Token")
    @PostMapping("/refresh")
    public Result<Map<String, String>> refreshToken(@RequestHeader("Authorization") String token) {
        // TODO: 实现Token刷新
        return Result.ok();
    }
}
