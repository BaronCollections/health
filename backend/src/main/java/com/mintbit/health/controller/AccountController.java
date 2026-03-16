package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.AccountFaqCategoryDto;
import com.mintbit.health.model.dto.account.CreateFeedbackRequest;
import com.mintbit.health.model.dto.account.FeedbackRecordDto;
import com.mintbit.health.model.dto.account.FeedbackRecordsResponse;
import com.mintbit.health.model.dto.account.NotificationListResponse;
import com.mintbit.health.model.dto.account.NotificationReadRequest;
import com.mintbit.health.service.MockAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Operation(summary = "获取 FAQ 分类")
    @GetMapping("/help/faq")
    public Result<List<AccountFaqCategoryDto>> getFaqCategories() {
        return Result.ok(mockAccountService.getFaqCategories());
    }

    @Operation(summary = "获取反馈记录")
    @GetMapping("/help/feedback/records")
    public Result<FeedbackRecordsResponse> getFeedbackRecords() {
        return Result.ok(mockAccountService.getFeedbackRecords());
    }

    @Operation(summary = "提交反馈")
    @PostMapping("/help/feedback")
    public Result<FeedbackRecordDto> createFeedback(@RequestBody CreateFeedbackRequest request) {
        return Result.ok(mockAccountService.createFeedback(request));
    }
}
