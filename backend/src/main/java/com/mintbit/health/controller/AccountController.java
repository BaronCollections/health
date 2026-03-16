package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.AccountFaqCategoryDto;
import com.mintbit.health.model.dto.account.AccountSecuritySnapshotDto;
import com.mintbit.health.model.dto.account.CreateDeleteRequest;
import com.mintbit.health.model.dto.account.CreateExportRequest;
import com.mintbit.health.model.dto.account.CreateFeedbackRequest;
import com.mintbit.health.model.dto.account.DeleteRequestDto;
import com.mintbit.health.model.dto.account.ExportRequestDto;
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

    @Operation(summary = "获取导出请求列表")
    @GetMapping("/privacy/export")
    public Result<List<ExportRequestDto>> getExportRequests() {
        return Result.ok(mockAccountService.getExportRequests());
    }

    @Operation(summary = "发起导出请求")
    @PostMapping("/privacy/export")
    public Result<ExportRequestDto> createExportRequest(@RequestBody CreateExportRequest request) {
        return Result.ok(mockAccountService.createExportRequest(request));
    }

    @Operation(summary = "获取删除申请列表")
    @GetMapping("/privacy/delete-request")
    public Result<List<DeleteRequestDto>> getDeleteRequests() {
        return Result.ok(mockAccountService.getDeleteRequests());
    }

    @Operation(summary = "发起删除申请")
    @PostMapping("/privacy/delete-request")
    public Result<DeleteRequestDto> createDeleteRequest(@RequestBody CreateDeleteRequest request) {
        return Result.ok(mockAccountService.createDeleteRequest(request));
    }

    @Operation(summary = "获取账户安全快照")
    @GetMapping("/security")
    public Result<AccountSecuritySnapshotDto> getSecuritySnapshot() {
        return Result.ok(mockAccountService.getSecuritySnapshot());
    }
}
