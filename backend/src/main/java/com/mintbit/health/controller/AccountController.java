package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.NotificationListResponse;
import com.mintbit.health.model.dto.account.NotificationReadRequest;
import com.mintbit.health.service.MockAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "账户中心接口")
@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private MockAccountService mockAccountService;

    @Operation(summary = "获取通知列表")
    @GetMapping("/notifications")
    public Result<NotificationListResponse> getNotifications(@RequestParam(required = false) String type) {
        return Result.ok(mockAccountService.getNotifications(type));
    }

    @Operation(summary = "获取通知详情")
    @GetMapping("/notifications/{notificationId}")
    public Result<AccountNotificationDto> getNotification(@PathVariable String notificationId) {
        return Result.ok(mockAccountService.getNotification(notificationId));
    }

    @Operation(summary = "标记单条通知已读")
    @PostMapping("/notifications/{notificationId}/read")
    public Result<AccountNotificationDto> markNotificationRead(@PathVariable String notificationId) {
        return Result.ok(mockAccountService.markNotificationRead(notificationId));
    }

    @Operation(summary = "批量标记通知已读")
    @PostMapping("/notifications/read-batch")
    public Result<NotificationListResponse> markNotificationsRead(@RequestBody NotificationReadRequest request) {
        return Result.ok(mockAccountService.markNotificationsRead(request));
    }
}
