package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.community.CommunityCircleDto;
import com.mintbit.health.model.dto.community.CommunityCommentDto;
import com.mintbit.health.model.dto.community.CommunityFeedResponse;
import com.mintbit.health.model.dto.community.CommunityPostDto;
import com.mintbit.health.model.dto.community.CreateCommunityCommentRequest;
import com.mintbit.health.model.dto.community.CreateCommunityPostRequest;
import com.mintbit.health.model.dto.community.ModerationDecisionRequest;
import com.mintbit.health.model.dto.community.ModerationItemDto;
import com.mintbit.health.model.dto.community.ModerationQueueResponse;
import com.mintbit.health.model.dto.community.MyCommunityPostsResponse;
import com.mintbit.health.service.MockCommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Tag(name = "社区接口")
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private MockCommunityService mockCommunityService;

    @Operation(summary = "获取动态流")
    @GetMapping("/feed")
    public Result<CommunityFeedResponse> getFeed() {
        return Result.ok(mockCommunityService.getFeed());
    }

    @Operation(summary = "发布动态")
    @PostMapping("/post")
    public Result<CommunityPostDto> createPost(@RequestBody CreateCommunityPostRequest request) {
        return Result.ok(mockCommunityService.createPost(request));
    }

    @Operation(summary = "获取帖子详情")
    @GetMapping("/post/{postId}")
    public Result<CommunityPostDto> getPostDetail(@PathVariable String postId) {
        return Result.ok(mockCommunityService.getPostDetail(postId));
    }

    @Operation(summary = "上传社区图片")
    @PostMapping("/upload/image")
    public Result<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        // TODO: 上传图片到MinIO，AI隐私自动模糊
        return Result.ok();
    }

    @Operation(summary = "点赞")
    @PostMapping("/post/{postId}/like")
    public Result<CommunityPostDto> like(@PathVariable String postId) {
        return Result.ok(mockCommunityService.likePost(postId));
    }

    @Operation(summary = "收藏帖子")
    @PostMapping("/post/{postId}/save")
    public Result<CommunityPostDto> save(@PathVariable String postId) {
        return Result.ok(mockCommunityService.savePost(postId));
    }

    @Operation(summary = "评论")
    @PostMapping("/post/{postId}/comment")
    public Result<CommunityCommentDto> comment(
            @PathVariable String postId,
            @RequestBody CreateCommunityCommentRequest request) {
        return Result.ok(mockCommunityService.addComment(postId, request));
    }

    @Operation(summary = "我的帖子")
    @GetMapping("/me/posts")
    public Result<MyCommunityPostsResponse> getMyPosts() {
        return Result.ok(mockCommunityService.getMyPosts());
    }

    @Operation(summary = "圈子列表")
    @GetMapping("/circles")
    public Result<List<CommunityCircleDto>> getCircles() {
        return Result.ok(mockCommunityService.getCircles());
    }

    @Operation(summary = "审核队列")
    @GetMapping("/moderation/queue")
    public Result<ModerationQueueResponse> getModerationQueue(@RequestParam(required = false) String status) {
        return Result.ok(mockCommunityService.getModerationQueue(status));
    }

    @Operation(summary = "审核通过")
    @PostMapping("/moderation/{targetType}/{targetId}/approve")
    public Result<ModerationItemDto> approve(
            @PathVariable String targetType,
            @PathVariable String targetId,
            @RequestBody(required = false) ModerationDecisionRequest request) {
        return Result.ok(mockCommunityService.approve(targetType, targetId, request));
    }

    @Operation(summary = "审核拒绝")
    @PostMapping("/moderation/{targetType}/{targetId}/reject")
    public Result<ModerationItemDto> reject(
            @PathVariable String targetType,
            @PathVariable String targetId,
            @RequestBody(required = false) ModerationDecisionRequest request) {
        return Result.ok(mockCommunityService.reject(targetType, targetId, request));
    }

    @Operation(summary = "审核标记")
    @PostMapping("/moderation/{targetType}/{targetId}/flag")
    public Result<ModerationItemDto> flag(
            @PathVariable String targetType,
            @PathVariable String targetId,
            @RequestBody(required = false) ModerationDecisionRequest request) {
        return Result.ok(mockCommunityService.flag(targetType, targetId, request));
    }

    @Operation(summary = "恢复到待审核")
    @PostMapping("/moderation/{targetType}/{targetId}/restore")
    public Result<ModerationItemDto> restore(
            @PathVariable String targetType,
            @PathVariable String targetId,
            @RequestBody(required = false) ModerationDecisionRequest request) {
        return Result.ok(mockCommunityService.restore(targetType, targetId, request));
    }

    @Operation(summary = "每日打卡")
    @PostMapping("/checkin")
    public Result<Map<String, Object>> checkin(@RequestBody Map<String, Object> body) {
        // TODO: 记录打卡，更新连续天数，检查勋章
        return Result.ok();
    }

    @Operation(summary = "获取勋章列表")
    @GetMapping("/badges")
    public Result<List<Map<String, Object>>> getBadges() {
        return Result.ok();
    }
}
