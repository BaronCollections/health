package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Tag(name = "社区接口")
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Operation(summary = "获取动态流")
    @GetMapping("/feed")
    public Result<Map<String, Object>> getFeed(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        // TODO: 分页获取社区动态（质量分权排序）
        return Result.ok();
    }

    @Operation(summary = "发布动态")
    @PostMapping("/post")
    public Result<Map<String, Object>> createPost(@RequestBody Map<String, Object> body) {
        // TODO: 发布动态，AI自动打标签，触发内容审核
        return Result.ok();
    }

    @Operation(summary = "上传社区图片")
    @PostMapping("/upload/image")
    public Result<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        // TODO: 上传图片到MinIO，AI隐私自动模糊
        return Result.ok();
    }

    @Operation(summary = "点赞")
    @PostMapping("/post/{postId}/like")
    public Result<Void> like(@PathVariable Long postId) {
        return Result.ok();
    }

    @Operation(summary = "评论")
    @PostMapping("/post/{postId}/comment")
    public Result<Map<String, Object>> comment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> body) {
        return Result.ok();
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
