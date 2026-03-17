package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.miniprogram.MiniProgramBindRequest;
import com.mintbit.health.model.dto.miniprogram.MiniProgramBindResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramLoginRequest;
import com.mintbit.health.model.dto.miniprogram.MiniProgramLoginResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramSmsSendRequest;
import com.mintbit.health.model.dto.miniprogram.MiniProgramSmsSendResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramUserProfileDto;
import com.mintbit.health.service.MockMiniProgramAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "小程序认证接口")
@RestController
@RequestMapping("/api/miniprogram/auth")
public class MiniProgramAuthController {

    @Autowired
    private MockMiniProgramAuthService mockMiniProgramAuthService;

    @Operation(summary = "微信登录")
    @PostMapping("/login")
    public Result<MiniProgramLoginResponse> login(@RequestBody MiniProgramLoginRequest request) {
        return Result.ok(mockMiniProgramAuthService.login(request == null ? null : request.getCode()));
    }

    @Operation(summary = "发送绑定验证码")
    @PostMapping("/sms/send")
    public Result<MiniProgramSmsSendResponse> sendSmsCode(@RequestBody MiniProgramSmsSendRequest request) {
        return Result.ok(mockMiniProgramAuthService.sendSmsCode(request == null ? null : request.getPhone()));
    }

    @Operation(summary = "绑定现有账号")
    @PostMapping("/bind")
    public Result<MiniProgramBindResponse> bind(@RequestBody MiniProgramBindRequest request) {
        return Result.ok(mockMiniProgramAuthService.bindPhone(
                request == null ? null : request.getPhone(),
                request == null ? null : request.getSmsCode(),
                request == null ? null : request.getBindToken()
        ));
    }

    @Operation(summary = "刷新小程序会话")
    @PostMapping("/refresh")
    public Result<MiniProgramBindResponse> refresh(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return Result.ok(mockMiniProgramAuthService.refreshSession(authorization));
    }

    @Operation(summary = "获取当前小程序用户")
    @GetMapping("/me")
    public Result<MiniProgramUserProfileDto> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return Result.ok(mockMiniProgramAuthService.getProfile(authorization));
    }
}
