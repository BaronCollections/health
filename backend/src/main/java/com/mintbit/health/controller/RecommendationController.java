package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "推荐方案接口")
@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    @Operation(summary = "生成推荐方案")
    @PostMapping("/generate/{assessmentId}")
    public Result<Map<String, Object>> generate(@PathVariable Long assessmentId) {
        // TODO: 基于评估数据，调用推荐引擎生成方案
        return Result.ok();
    }

    @Operation(summary = "获取推荐方案详情")
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getRecommendation(@PathVariable Long id) {
        // TODO: 获取推荐方案（含剂量安全检查结果）
        return Result.ok();
    }

    @Operation(summary = "剂量安全检查")
    @PostMapping("/safety-check")
    public Result<Map<String, Object>> safetyCheck(@RequestBody Map<String, Object> body) {
        // TODO: 全局剂量冲突检查（碰撞检测）
        return Result.ok();
    }

    @Operation(summary = "获取用户历史推荐")
    @GetMapping("/history")
    public Result<Map<String, Object>> getHistory() {
        // TODO: 用户所有历史推荐方案
        return Result.ok();
    }
}
